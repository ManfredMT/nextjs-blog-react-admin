import {getAllLinksData} from "../lib/linksData";

export default function Links({allLinks}) {
    console.log("allLinks: ",allLinks);
    return <main>友链</main>;

}

export async function getStaticProps() {
    const allLinks = await getAllLinksData();
    return {
        props:{
            allLinks
        }
    };

}