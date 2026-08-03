import { getCollection } from 'astro:content';
import site from '../data/site.json';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    const entities: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      "'": '&apos;',
      '"': '&quot;',
    };
    return entities[character];
  });

export async function GET({ site: astroSite }: { site: URL }) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf(),
  );
  const base = import.meta.env.BASE_URL;
  const home = new URL(base, astroSite).toString();
  const items = posts
    .map((post) => {
      const url = new URL(`${base}insights/${post.id}/`, astroSite).toString();
      return `<item>
        <title>${escapeXml(post.data.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <description>${escapeXml(post.data.description)}</description>
        <category>${escapeXml(post.data.category)}</category>
        <pubDate>${post.data.publishedAt.toUTCString()}</pubDate>
      </item>`;
    })
    .join('');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"><channel>
      <title>${escapeXml(site.name)}</title>
      <link>${home}</link>
      <description>${escapeXml(site.description)}</description>
      <language>id-ID</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${new URL(`${base}rss.xml`, astroSite)}" rel="self" type="application/rss+xml"/>
      ${items}
    </channel></rss>`;
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
