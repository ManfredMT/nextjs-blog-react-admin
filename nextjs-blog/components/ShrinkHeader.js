import Header from "./Header";
import { useEffect, useState } from "react";

export default function ShrinkHeader({ siteMetadata, nav, postTitle }) {
  const [shrink, setShrink] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setShrink(window.pageYOffset > 80);
    }
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
    return ()=>{
      if(typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
    }
  }, []);

  return (
    <Header
      shrink={shrink}
      siteMetadata={siteMetadata}
      nav={nav}
      postTitle={postTitle}
    />
  );
}
