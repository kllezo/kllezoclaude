import Universe from "@/components/creative/Universe";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  exp: "creative",
  path: "",
  title: "Built To Grow Businesses",
  description: "A living digital universe. Content Engine, Website Experiences, AI Calling Agents and AI Texting Agents.",
});

export default function CreativeHome() {
  return (
    <>
      <h1 className="sr-only">KLLEZO — Built To Grow Businesses</h1>
      <Universe />
    </>
  );
}
