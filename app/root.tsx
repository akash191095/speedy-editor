import { NextUIProvider } from "@nextui-org/react";
import { User } from "@prisma/client";
import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";

import Nav from "./components/Nav";
import { getUser } from "./session.server";
import {
  NonFlashOfWrongThemeEls,
  Theme,
  ThemeProvider,
  useTheme,
} from "./utils/theme-provider";
import { getThemeSession } from "./utils/theme.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export interface LoaderData {
  theme: Theme | null;
  user: User | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
    user: await getUser(request),
  };

  return data;
};

function App() {
  const data = useLoaderData<LoaderData>();
  const [theme] = useTheme();
  return (
    <html
      lang="en"
      className={`${theme as string} h-full text-foreground bg-background`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="h-full">
        <NextUIProvider className="h-full">
          <Nav />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </NextUIProvider>
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
