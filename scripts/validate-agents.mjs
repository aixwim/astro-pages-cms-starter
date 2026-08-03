import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const directory = path.resolve('.agents');
const files = (await readdir(directory))
  .filter((name) => name.endsWith('.md') && name !== 'INDEX.md')
  .sort();
const expectedCount = 40;
const requiredHeadings = [
  '## Mission',
  '## Mode and ownership',
  '## Required inputs',
  '## Procedure',
  '## Deliverable',
  '## Required verification',
  '## Safety',
];
const failures = [];

if (files.length !== expectedCount) {
  failures.push(`Expected ${expectedCount} agents, found ${files.length}.`);
}

const index = await readFile(path.join(directory, 'INDEX.md'), 'utf8');
for (const file of files) {
  const source = await readFile(path.join(directory, file), 'utf8');
  for (const heading of requiredHeadings) {
    if (!source.includes(heading)) failures.push(`${file}: missing ${heading}`);
  }
  if (!index.includes(`(${file})`)) {
    failures.push(`INDEX.md: missing link to ${file}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(
  `Agent check passed: ${files.length} specialists indexed with complete contracts.`,
);
