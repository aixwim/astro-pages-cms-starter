import { google } from 'googleapis';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
if (!folderId) throw new Error('GOOGLE_DRIVE_FOLDER_ID is required.');
let credentials;
if (process.env.GDRIVE_CREDENTIALS_BASE64)
  credentials = JSON.parse(
    Buffer.from(process.env.GDRIVE_CREDENTIALS_BASE64, 'base64').toString(
      'utf8',
    ),
  );
else if (process.env.GOOGLE_APPLICATION_CREDENTIALS)
  credentials = JSON.parse(
    await readFile(process.env.GOOGLE_APPLICATION_CREDENTIALS, 'utf8'),
  );
else
  throw new Error(
    'Set GDRIVE_CREDENTIALS_BASE64 or GOOGLE_APPLICATION_CREDENTIALS.',
  );
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });
const output = path.resolve('public/drive');
const safe = (name) =>
  name
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'file';
const exportTypes = {
  'application/vnd.google-apps.document': ['application/pdf', '.pdf'],
  'application/vnd.google-apps.spreadsheet': [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xlsx',
  ],
  'application/vnd.google-apps.presentation': ['application/pdf', '.pdf'],
};
await mkdir(output, { recursive: true });
const response = await drive.files.list({
  q: `'${folderId}' in parents and trashed = false`,
  fields: 'files(id,name,mimeType,modifiedTime)',
  orderBy: 'name',
});
const manifest = [];
for (const file of response.data.files ?? []) {
  if (file.mimeType === 'application/vnd.google-apps.folder') continue;
  const spec = exportTypes[file.mimeType];
  const filename = `${safe(file.name)}${spec && !path.extname(file.name) ? spec[1] : ''}`;
  const result = spec
    ? await drive.files.export(
        { fileId: file.id, mimeType: spec[0] },
        { responseType: 'arraybuffer' },
      )
    : await drive.files.get(
        { fileId: file.id, alt: 'media' },
        { responseType: 'arraybuffer' },
      );
  await writeFile(path.join(output, filename), Buffer.from(result.data));
  manifest.push({
    filename,
    sourceName: file.name,
    mimeType: file.mimeType,
    modifiedTime: file.modifiedTime,
  });
}
await writeFile(
  path.join(output, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
console.log(
  `Synced ${manifest.length} file(s) locally. Review before committing.`,
);
