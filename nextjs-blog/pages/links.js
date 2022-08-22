import { getAllLinksData } from "../lib/linksData";
import { getSiteMetadata } from "../lib/siteData";
import { PageSEO } from "../components/SEO";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/Links.module.css";
import Image from "next/image";
import styleAni from "../styles/AnimatePublic.module.css";

export default function Links({ allLinks, siteMetadata }) {
  const linkIcon = (
    <svg
      className={styles["link-icon"]}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 195.085 195.085"
    >
      <g>
        <path
          d="M179.617,15.453c-0.051-0.05-0.102-0.1-0.154-0.149c-18.689-18.549-48.477-20.463-69.37-4.441
   c-2.091,1.599-3.776,3.053-5.302,4.575c-0.044,0.044-0.087,0.088-0.13,0.133L71.224,49.012c-2.929,2.929-2.929,7.678,0.001,10.606
   c2.93,2.93,7.679,2.929,10.606-0.001l33.561-33.566c0.035-0.035,0.069-0.07,0.104-0.105c1.023-1.01,2.205-2.02,3.715-3.174
   c15.008-11.508,36.411-10.098,49.789,3.281c0.044,0.044,0.089,0.088,0.134,0.131c14.652,14.786,14.611,38.742-0.124,53.483
   l-33.559,33.563c-2.929,2.929-2.929,7.678,0.001,10.606c1.465,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.304-2.197
   l33.56-33.563C200.241,69.641,200.241,36.077,179.617,15.453z"
        />
        <path
          d="M113.23,135.437l-33.541,33.542c-0.066,0.067-0.132,0.136-0.196,0.205c-3.708,3.648-8.059,6.449-12.945,8.333
   c-13.995,5.418-29.888,2.07-40.481-8.524c-14.768-14.784-14.768-38.84,0-53.619L59.624,81.83c1.406-1.407,2.197-3.315,2.197-5.305
   v-0.013c0-4.143-3.357-7.494-7.5-7.494c-2.135,0-4.062,0.895-5.428,2.328l-33.435,33.422c-20.61,20.628-20.612,54.195-0.002,74.828
   c10.095,10.097,23.628,15.479,37.411,15.479c6.414-0.001,12.884-1.167,19.084-3.566c6.922-2.667,13.088-6.67,18.326-11.896
   c0.076-0.075,0.15-0.153,0.223-0.232l33.337-33.337c2.929-2.93,2.929-7.678-0.001-10.607
   C120.909,132.509,116.16,132.509,113.23,135.437z"
        />
        <path
          d="M59.15,135.908c1.465,1.465,3.384,2.197,5.304,2.197c1.919,0,3.839-0.732,5.303-2.196l66.164-66.161
   c2.93-2.929,2.93-7.678,0.001-10.606c-2.929-2.93-7.678-2.929-10.606-0.001l-66.164,66.161
   C56.221,128.23,56.221,132.979,59.15,135.908z"
        />
      </g>
    </svg>
  );

  return (
    <>
      <PageSEO
        title={`友情链接 - ${siteMetadata.author}`}
        description={siteMetadata.description}
        siteUrl={siteMetadata.siteUrl}
        siteName={siteMetadata.name}
        socialBanner={siteMetadata.socialBanner}
      />
      <Header siteMetadata={siteMetadata} nav="links" />
      <main className={`${styles["links-page-main"]} ${styleAni["fade-in-top"]}`}>
        <div className={styles["grid-wrap"]}>
          {allLinks.map((link) => {
            let description = link.website;
            if (link.description) {
              if (link.description.length > 40) {
                description = link.description.substr(0, 40) + "...";
              } else {
                description = link.description;
              }
            }
            return (
              <div key={link.id} className={styles["link-card"]}>
                {link.picture ? (
                  <Image
                    src={link.picture}
                    alt={link.name}
                    width={80}
                    height={80}
                    className={styles["link-picture"]}
                  />
                ) : (
                  linkIcon
                )}

                <div className={styles["link-info-box"]}>
                  <h3 className={styles["link-name"]}>
                    <a
                      href={link.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.name}
                    </a>
                  </h3>

                  {link.description ? (
                    <p
                      title={link.description}
                      className={styles["link-description"]}
                    >
                      {description}
                    </p>
                  ) : (
                    <p className={styles["link-url"]}>{link.website}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer siteMetadata={siteMetadata} />
    </>
  );
}

export async function getStaticProps() {
  const allLinks = await getAllLinksData();
  const siteMetadata = await getSiteMetadata();
  return {
    props: {
      allLinks,
      siteMetadata,
    },
  };
}
