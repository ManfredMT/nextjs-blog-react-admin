import Header from "./Header";
import { useEffect, useState } from "react";

export default function ShrinkHeader({ siteMetadata, nav, postTitle }) {
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        
        setShrink(window.pageYOffset > 80)
      );
    }
  }, []);

  return <Header shrink={shrink} siteMetadata={siteMetadata} nav={nav} postTitle={postTitle} />;
}
