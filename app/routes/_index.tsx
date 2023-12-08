import type { MetaFunction } from "@remix-run/node";

import Nav from "~/components/Nav";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto"></main>
    </>
  );
}
