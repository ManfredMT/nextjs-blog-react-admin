import { getPostRelatedPath } from "../../lib/posts";


export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (req.query.change === "post") {
    const revalidatePaths = await getPostRelatedPath();
    try {
        await Promise.all(revalidatePaths.map((path)=>res.revalidate(path)));
        return res.json({ revalidated: true });
      } catch (err) {
        return res.status(500).send("Error revalidating");
      }
  } else if (req.query.change === "link") {
    try {
      await res.revalidate("/links");
      return res.json({ revalidated: true });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send("Error revalidating");
    }
  } else {
    return res.status(400).json({ message: "Invalid change value" });
  }
}
