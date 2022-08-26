// 参考 https://github.com/timlrx/tailwind-nextjs-starter-blog
import { escape } from './utils/htmlEscaper';

const generateRssItem = (siteMetadata, post, isCategory) => `
  <item>
    <guid>${siteMetadata.siteUrl}/posts/${post.title}</guid>
    <title>${escape(post.title)}</title>
    <link>${siteMetadata.siteUrl}/posts/${post.title}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${siteMetadata.email} (${siteMetadata.author})</author>
    ${isCategory?(`<category>${post.category}</category>`)
    :
    (post.tags && post.tags.map((t) => `<category>${t}</category>`).join(''))}
  </item>
`;


const generateRss = (posts, siteMetadata, page = 'feed.xml') => `
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteMetadata.title)}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>${escape(siteMetadata.description)}</description>
    <language>${siteMetadata.language}</language>
    <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
    <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
    <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
    <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
    ${posts.map((post)=>generateRssItem(siteMetadata, post, page.includes('categories'))).join('')}
  </channel>
</rss>
`





export default generateRss;
