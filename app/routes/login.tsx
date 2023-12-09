import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Checkbox,
} from "@nextui-org/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import BG from "~/assets/bg2-comp.jpg";
import { verifyLogin } from "~/models/user.server";
import { createUserSession, getUserId } from "~/session.server";
import { safeRedirect, validateEmail } from "~/utils/utils";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  const remember = formData.get("remember");

  if (!validateEmail(email)) {
    return json(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 },
    );
  }

  if (typeof password !== "string" || password.length === 0) {
    return json(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return json(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 },
    );
  }

  const user = await verifyLogin(email, password);

  if (!user) {
    return json(
      { errors: { email: "Invalid email or password", password: null } },
      { status: 400 },
    );
  }

  return createUserSession({
    redirectTo,
    remember: remember === "on" ? true : false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Login" }];

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const actionData = useActionData<typeof action>();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <main className="flex min-h-[calc(100vh-64px)] justify-center items-center">
      <div className="hidden h-[calc(100vh-64px)] basis-2/5 md:flex lg:basis-3/5">
        <img src={BG} alt="background" className="object-cover w-full" />
      </div>
      <Card className="max-w-[700px] w-96 mx-auto py-14 px-6">
        <CardHeader className="flex justify-center mb-4">
          <p className="text-2xl font-bold">Welcome Back!</p>
        </CardHeader>
        <CardBody>
          <Form method="post" className="space-y-6">
            <div className="mb-8">
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                aria-invalid={actionData?.errors?.email ? true : undefined}
                aria-describedby="email-error"
                ref={emailRef}
                errorMessage={actionData?.errors?.email}
                isInvalid={!!actionData?.errors?.email}
                name="email"
              />
              <Input
                label="Password"
                type="password"
                aria-invalid={actionData?.errors?.password ? true : undefined}
                aria-describedby="password-error"
                errorMessage={actionData?.errors?.password}
                isInvalid={!!actionData?.errors?.password}
                name="password"
                ref={passwordRef}
                className="mt-6"
              />
              <Checkbox name="remember" defaultSelected className="mt-6">
                Remember
              </Checkbox>
              <input type="hidden" name="redirectTo" value={redirectTo} />
            </div>

            <Button type="submit" color="secondary">
              Login
            </Button>

            <div className="flex items-center justify-between">
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  className="text-secondary underline"
                  to={{
                    pathname: "/join",
                    search: searchParams.toString(),
                  }}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </main>
  );
}
