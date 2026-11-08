import OriginalServices from "@/components/creative/OriginalServices";
import { loadOriginalPage } from "@/lib/creativeOriginal";
import { pageMeta } from "@/lib/seo";

const page = loadOriginalPage("services");

export const metadata = pageMeta({ exp: "creative", path: "/services", title: page.title, description: page.description });

export default function CreativeServices() {
  return <OriginalServices html={page.html} landing />;
}
