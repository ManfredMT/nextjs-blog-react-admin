//参考 https://nextjs.org/learn/seo/crawling-and-indexing/xml-sitemaps

import {getAllTags, getAllCategories, getAllPostTitles} from "../lib/posts";
import {getSiteMetadata} from "../lib/siteData";

function generateSiteMap(siteMetadata, tags, categories, postSlugArray) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${siteMetadata.siteUrl}</loc>
     </url>
     <url>
       <loc>${siteMetadata.siteUrl}/categories</loc>
     </url>
     <url>
       <loc>${siteMetadata.siteUrl}/tags</loc>
     </url>
     <url>
       <loc>${siteMetadata.siteUrl}/timeline</loc>
     </url>
     <url>
       <loc>${siteMetadata.siteUrl}/links</loc>
     </url>
     ${categories
       .map((category) => {
         return `
       <url>
           <loc>${siteMetadata.siteUrl}/categories/${category}</loc>
       </url>
     `;
       })
       .join('')}
       ${tags
        .map((tag) => {
          return `
        <url>
            <loc>${siteMetadata.siteUrl}/tags/${tag}</loc>
        </url>
      `;
        })
        .join('')}
        ${postSlugArray
            .map((slug) => {
              return `
            <url>
                <loc>${siteMetadata.siteUrl}/posts/${slug}</loc>
            </url>
          `;
            })
            .join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const allTags = await getAllTags();
  const allCategories = await getAllCategories();
  const allPostTitles = await getAllPostTitles();
  const siteMetadata = await getSiteMetadata();

  const tags = allTags.map((t)=>t.tagName);
  const postSlugArray = allPostTitles.map((p)=>p.params.slug);

  const sitemap = generateSiteMap(siteMetadata, tags, allCategories, postSlugArray);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;