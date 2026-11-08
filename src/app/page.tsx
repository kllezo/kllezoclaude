import Entry from "@/components/entry/Entry";

/* `/` — the experience selection screen. Returning visitors are sent
   straight to their remembered experience by src/proxy.ts; `/?choose`
   always shows this screen. */
export default function Home() {
  return <Entry />;
}
