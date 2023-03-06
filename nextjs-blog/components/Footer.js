import styles from "../styles/Footer.module.css";

export default function Footer({ siteMetadata }) {
  return (
    <footer className={styles["footer"]}>
      <div className={styles["social-info-box"]}>
        <span className={styles["icon-box"]}>
          <span className={styles["tooltip"]}>{siteMetadata.email}</span>
          <svg
            className={styles["svg-logo"]}
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 75.294 75.294"
          >
            <g>
              <path
                d="M66.097,12.089h-56.9C4.126,12.089,0,16.215,0,21.286v32.722c0,5.071,4.126,9.197,9.197,9.197h56.9
		c5.071,0,9.197-4.126,9.197-9.197V21.287C75.295,16.215,71.169,12.089,66.097,12.089z M61.603,18.089L37.647,33.523L13.691,18.089
		H61.603z M66.097,57.206h-56.9C7.434,57.206,6,55.771,6,54.009V21.457l29.796,19.16c0.04,0.025,0.083,0.042,0.124,0.065
		c0.043,0.024,0.087,0.047,0.131,0.069c0.231,0.119,0.469,0.215,0.712,0.278c0.025,0.007,0.05,0.01,0.075,0.016
		c0.267,0.063,0.537,0.102,0.807,0.102c0.001,0,0.002,0,0.002,0c0.002,0,0.003,0,0.004,0c0.27,0,0.54-0.038,0.807-0.102
		c0.025-0.006,0.05-0.009,0.075-0.016c0.243-0.063,0.48-0.159,0.712-0.278c0.044-0.022,0.088-0.045,0.131-0.069
		c0.041-0.023,0.084-0.04,0.124-0.065l29.796-19.16v32.551C69.295,55.771,67.86,57.206,66.097,57.206z"
              />
            </g>
          </svg>
        </span>

        {siteMetadata.wx ? (
          <span className={styles["icon-box"]}>
            <span className={styles["tooltip"]}>{siteMetadata.wx}</span>
            <svg
              className={styles["svg-logo"]}
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="31.403px"
              height="31.404px"
              viewBox="0 0 31.403 31.404"
            >
              <g>
                <g>
                  <path
                    d="M31.403,21.306c0-4.597-4.388-8.32-9.8-8.32c-5.414,0-9.802,3.725-9.802,8.32c0,4.597,4.388,8.322,9.802,8.322
			c1.701,0,3.302-0.369,4.697-1.019l3.863,1.671l-0.447-4.309C30.782,24.642,31.403,23.034,31.403,21.306z M18.301,19.052
			c-0.771,0-1.395-0.625-1.395-1.395s0.623-1.395,1.395-1.395c0.77,0,1.393,0.625,1.393,1.395S19.069,19.052,18.301,19.052z
			 M24.905,19.052c-0.769,0-1.394-0.625-1.394-1.395s0.625-1.395,1.394-1.395c0.771,0,1.396,0.625,1.396,1.395
			S25.676,19.052,24.905,19.052z"
                  />
                  <path
                    d="M21.604,11.885c1.515,0,2.957,0.27,4.271,0.755c0.009-0.175,0.03-0.345,0.03-0.521c0-6.074-5.801-10.996-12.953-10.996
			C5.799,1.123,0,6.044,0,12.119c0,2.284,0.822,4.408,2.229,6.167L1.638,23.98l5.104-2.213c1.264,0.59,2.661,0.986,4.136,1.189
			c-0.111-0.538-0.179-1.087-0.179-1.65C10.7,16.111,15.591,11.885,21.604,11.885z M17.317,5.457c1.017,0,1.84,0.824,1.84,1.84
			c0,1.018-0.823,1.842-1.84,1.842c-1.019,0-1.841-0.824-1.841-1.842C15.476,6.281,16.301,5.457,17.317,5.457z M8.586,9.139
			c-1.017,0-1.84-0.824-1.84-1.842c0-1.016,0.823-1.84,1.84-1.84c1.018,0,1.841,0.824,1.841,1.84
			C10.427,8.313,9.603,9.139,8.586,9.139z"
                  />
                </g>
              </g>
            </svg>
          </span>
        ) : null}

        <a
          href={siteMetadata.siteUrl + "/feed.xml"}
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            className={styles["svg-logo"]}
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>RSS icon</title>
            <path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" />
          </svg>
        </a>

        {siteMetadata.github ? (
          <a
            href={siteMetadata.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className={styles["svg-logo"]}
              width="15px"
              height="15px"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.35762 2.14496C8.13548 1.86102 6.86444 1.86102 5.6423 2.14497C4.93642 1.71169 4.39704 1.51286 4.00502 1.42909C3.79189 1.38354 3.62296 1.37216 3.4959 1.37556C3.43249 1.37725 3.38001 1.38261 3.33821 1.38905C3.31733 1.39226 3.29919 1.39573 3.28375 1.39911C3.27603 1.4008 3.26899 1.40247 3.26264 1.40408L3.25362 1.40643L3.2495 1.40756L3.24753 1.40811L3.24563 1.40865C3.24562 1.40865 3.24563 1.40864 3.24563 1.40865C3.2452 1.40884 3.24731 1.41452 3.38299 1.88895L3.24563 1.40865C3.1036 1.44926 2.9868 1.55061 2.92657 1.68549C2.75841 2.06202 2.66657 2.46816 2.65635 2.88041C2.64875 3.18677 2.68634 3.49199 2.76743 3.78633C2.55433 4.04445 2.3807 4.33349 2.25276 4.64407C2.08484 5.05173 1.99894 5.4885 1.99998 5.92939C2.00011 7.48194 2.45815 8.52582 3.23873 9.19657C3.78563 9.66653 4.45048 9.91658 5.11619 10.0598C5.00626 10.3652 4.97773 10.6883 4.99998 11.0176V11.6158C4.59263 11.7015 4.31135 11.6744 4.11082 11.6082C3.85884 11.525 3.66566 11.3578 3.48139 11.1175C3.38806 10.9959 3.30208 10.8623 3.21179 10.7161L3.15448 10.6228C3.08377 10.5073 3.00746 10.3828 2.93045 10.2692C2.73964 9.9878 2.45813 9.63616 2.00195 9.51639L1.51834 9.38942L1.2644 10.3566L1.74801 10.4836C1.82746 10.5045 1.93204 10.5786 2.10279 10.8304C2.16553 10.9229 2.22538 11.0206 2.29372 11.1321C2.31518 11.1671 2.33753 11.2036 2.36102 11.2417C2.45488 11.3936 2.56253 11.5627 2.68796 11.7262C2.94119 12.0563 3.28597 12.389 3.79742 12.5578C4.14883 12.6738 4.54603 12.7016 4.99998 12.6319V14.5C4.99998 14.7761 5.22384 15 5.49998 15H9.49998C9.77613 15 9.99998 14.7761 9.99998 14.5V10.9375C9.99998 10.6217 9.98623 10.333 9.89735 10.0636C10.5597 9.92381 11.2193 9.67353 11.7626 9.20319C12.5429 8.52773 13 7.47445 13 5.9125L13 5.91089C12.9975 5.13212 12.7242 4.38197 12.2325 3.78635C12.3136 3.492 12.3512 3.18678 12.3436 2.88041C12.3334 2.46816 12.2416 2.06202 12.0734 1.68549C12.0131 1.55057 11.8963 1.44921 11.7542 1.40861L11.6169 1.88937C11.7542 1.40861 11.7528 1.40821 11.7523 1.40807L11.7504 1.40752L11.7462 1.4064L11.7372 1.40405C11.7309 1.40245 11.7238 1.40078 11.7161 1.39909C11.7007 1.39571 11.6826 1.39225 11.6617 1.38904C11.6199 1.38261 11.5674 1.37725 11.504 1.37556C11.3769 1.37216 11.2079 1.38354 10.9947 1.42908C10.6026 1.51286 10.0633 1.71168 9.35762 2.14496Z" />
            </svg>
          </a>
        ) : null}

        {siteMetadata.juejin ? (
          <a
            href={siteMetadata.juejin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className={styles["svg-logo"]}
              width="36"
              height="28"
              viewBox="0 0 36 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5875 6.77268L21.8232 3.40505L17.5875 0.00748237L17.5837 0L13.3555 3.39757L17.5837 6.76894L17.5875 6.77268ZM17.5863 17.3955H17.59L28.5161 8.77432L25.5526 6.39453L17.59 12.6808H17.5863L17.5825 12.6845L9.61993 6.40201L6.66016 8.78181L17.5825 17.3992L17.5863 17.3955ZM17.5828 23.2891L17.5865 23.2854L32.2133 11.7456L35.1768 14.1254L28.5238 19.3752L17.5865 28L0.284376 14.3574L0 14.1291L2.95977 11.7531L17.5828 23.2891Z"
              />
            </svg>
          </a>
        ) : null}

        {siteMetadata.zhihu ? (
          <a
            href={siteMetadata.zhihu}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className={styles["svg-logo"]}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g>
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  fillRule="nonzero"
                  d="M13.373 18.897h1.452l.478 1.637 2.605-1.637h3.07V5.395h-7.605v13.502zM14.918 6.86h4.515v10.57h-1.732l-1.73 1.087-.314-1.084-.739-.003V6.861zm-2.83 4.712H8.846a70.3 70.3 0 0 0 .136-4.56h3.172s.122-1.4-.532-1.384H6.135c.216-.814.488-1.655.813-2.524 0 0-1.493 0-2 1.339-.211.552-.82 2.677-1.904 4.848.365-.04 1.573-.073 2.284-1.378.131-.366.156-.413.318-.902h1.79c0 .651-.074 4.151-.104 4.558h-3.24c-.729 0-.965 1.466-.965 1.466h4.066C6.92 16.131 5.456 18.74 2.8 20.8c1.27.363 2.536-.057 3.162-.614 0 0 1.425-1.297 2.206-4.298l3.346 4.03s.49-1.668-.077-2.481c-.47-.554-1.74-2.052-2.281-2.595l-.907.72c.27-.867.433-1.71.488-2.524h3.822s-.005-1.466-.47-1.466z"
                />
              </g>
            </svg>
          </a>
        ) : null}
      </div>
      <div className={styles["copyright-box"]}>
        {`Copyright © ${siteMetadata.title} ${new Date().getFullYear()} • All rights reserved.`}
      </div>
      <a
        className={styles["copyright-support"]}
        href="https://nextjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by Next.js
      </a>
    </footer>
  );
}
