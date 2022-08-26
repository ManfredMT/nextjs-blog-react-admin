// 参考 https://github.com/timlrx/tailwind-nextjs-starter-blog
import Head from "next/head";
import { useRouter } from "next/router";

const CommonSEO = ({
  title,
  description,
  ogType,
  ogImage,
  canonicalUrl,
  siteUrl,
  siteName,
}) => {
  const router = useRouter();
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${siteUrl}${router.asPath}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {ogImage.constructor.name === "Array" ? (
        ogImage.map(({ url }) => (
          <meta property="og:image" content={url} key={url} />
        ))
      ) : (
        <meta property="og:image" content={ogImage} key={ogImage} />
      )}

      <link
        rel="canonical"
        href={canonicalUrl ? canonicalUrl : `${siteUrl}${router.asPath}`}
      />
    </Head>
  );
};

export const PageSEO = ({
  title,
  description,
  siteUrl,
  siteName,
  socialBanner,
}) => {
  const ogImageUrl = siteUrl + socialBanner;
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      siteUrl={siteUrl}
      siteName={siteName}
    />
  );
};

export const TagSEO = ({
  title,
  description,
  siteUrl,
  siteName,
  socialBanner,
}) => {
  const ogImageUrl = siteUrl + socialBanner;
  const router = useRouter();
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={ogImageUrl}
        siteUrl={siteUrl}
        siteName={siteName}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteUrl}${router.asPath}/feed.xml`}
        />
      </Head>
    </>
  );
};

export const CategorySEO = ({
  title,
  description,
  siteUrl,
  siteName,
  socialBanner,
}) => {
  const ogImageUrl = siteUrl + socialBanner;
  const router = useRouter();
  return (
    <>
      <CommonSEO
        title={title}
        description={description}
        ogType="website"
        ogImage={ogImageUrl}
        siteUrl={siteUrl}
        siteName={siteName}
      />
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${description} - RSS feed`}
          href={`${siteUrl}${router.asPath}/feed.xml`}
        />
      </Head>
    </>
  );
};

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date,
  lastmod,
  url,
  images = [],
  canonicalUrl,
  siteUrl,
  siteName,
  socialBanner,
  author,
  siteLogo,
}) => {
  const publishedAt = new Date(date).toISOString();
  const modifiedAt = new Date(lastmod || date).toISOString();
  let imagesArr =
    images.length === 0
      ? [socialBanner]
      : typeof images === "string"
      ? [images]
      : images;

  const featuredImages = imagesArr.map((img) => {
    return {
      "@type": "ImageObject",
      url: `${siteUrl}${img}`,
    };
  });

  let authorList;
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        "@type": "Person",
        name: author.name,
      };
    });
  } else {
    authorList = {
      "@type": "Person",
      name: author,
    };
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt,
    dateModified: modifiedAt,
    author: authorList,
    publisher: {
      "@type": "Organization",
      name: author,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}${siteLogo}`,
      },
    },
    description: summary,
  };


  return (
    <>
      <CommonSEO
        title={title}
        description={summary}
        ogType="article"
        ogImage={featuredImages}
        canonicalUrl={canonicalUrl}
        siteUrl={siteUrl}
        siteName={siteName}
      />
      <Head>
        {date && (
          <meta property="article:published_time" content={publishedAt} />
        )}
        {lastmod && (
          <meta property="article:modified_time" content={modifiedAt} />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  );
};
