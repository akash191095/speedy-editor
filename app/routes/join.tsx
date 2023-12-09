import { Card, CardHeader, CardBody, Input, Button } from "@nextui-org/react";
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { useEffect, useRef } from "react";

import BG from "~/assets/bg1.jpg";
import { createUser, getUserByEmail } from "~/models/user.server";
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

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json(
      {
        errors: {
          email: "A user already exists with this email",
          password: null,
        },
      },
      { status: 400 },
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    redirectTo,
    remember: false,
    request,
    userId: user.id,
  });
};

export const meta: MetaFunction = () => [{ title: "Sign Up" }];

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
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
    <main className="flex min-h-full justify-center items-center">
      <div className="hidden min-h-screen basis-2/5 md:flex lg:basis-3/5">
        <img src={BG} alt="background" className="object-cover" />
      </div>
      <Card className="max-w-[700px] w-96 mx-auto py-14 px-6">
        <CardHeader className="flex justify-center mb-4">
          <p className="text-2xl font-bold">Create your account now</p>
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
              <input type="hidden" name="redirectTo" value={redirectTo} />
            </div>

            <Button type="submit" color="secondary">
              Create Account
            </Button>

            <div className="flex items-center justify-start">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  className="text-secondary underline"
                  to={{
                    pathname: "/login",
                    search: searchParams.toString(),
                  }}
                >
                  Log in
                </Link>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
    </main>
  );
}
