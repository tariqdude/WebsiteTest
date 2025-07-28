import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_CONFIG } from '../../astro.config.mjs';

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'Astro Blog',
    description: 'A blog about Astro and web development.',
    site: SITE_CONFIG.site + SITE_CONFIG.base,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
