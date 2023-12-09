import { Button, Card, CardBody, Divider } from "@nextui-org/react";
import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import DemoImg from "~/assets/demo-comp.jpg";
import DemoDarkImg from "~/assets/demo-dark-comp.jpg";
import ImageEditor from "~/components/ImageEditor/ImageEditor";
import { Theme, useTheme } from "~/utils/theme-provider";
import { useOptionalUser } from "~/utils/utils";

export const meta: MetaFunction = () => [{ title: "Speedy Editor" }];

export default function Index() {
  const user = useOptionalUser();
  const navigate = useNavigate();
  const [theme] = useTheme();
  return (
    <>
      <main className="max-w-7xl mx-auto">
        {user ? (
          <ImageEditor />
        ) : (
          <section className="flex justify-center items-center flex-col p-12">
            <h1 className="text-4xl md:text-5xl font-thin mt-12">
              The best photo editor is here!
            </h1>
            <img
              src={theme === Theme.DARK ? DemoDarkImg : DemoImg}
              alt="screenshot"
              className="h-96 mt-12 max-w-full"
            />
            <Divider className="mt-20" />
            <section className="mb-40">
              <h1 className="text-4xl md:text-5xl font-thin mt-12">
                Get Started Right Away!
              </h1>
              <Card className="max-w-[700px] w-96 mx-auto py-14 px-6 mt-24 shadow shadow-glow">
                <CardBody className="flex gap-9">
                  <Button color="secondary" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button color="danger" onClick={() => navigate("/join")}>
                    Sign up
                  </Button>
                </CardBody>
              </Card>
            </section>
          </section>
        )}
      </main>
    </>
  );
}
