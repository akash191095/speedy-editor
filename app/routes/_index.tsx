import { Button } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";

import { Theme, useTheme } from "~/utils/theme-provider";
import { useOptionalUser } from "~/utils/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  };

  return (
    <main className="max-w-7xl mx-auto">
      <Button variant="solid" color="primary" onClick={toggleTheme}>
        Toggle
      </Button>
    </main>
  );
}
