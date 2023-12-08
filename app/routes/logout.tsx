import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

import { logout } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await logout(request);
};

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
