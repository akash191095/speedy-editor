import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Link,
} from "@nextui-org/react";
import { useFetcher } from "@remix-run/react";
import { PiSunBold, PiMoonStars } from "react-icons/pi";

import { Theme, useTheme } from "~/utils/theme-provider";
import { useOptionalUser } from "~/utils/utils";

export default function Nav() {
  const user = useOptionalUser();
  const fetcher = useFetcher();
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  };

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">SPEEDY EDITOR</p>
      </NavbarBrand>
      {user ? (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Button
              onClick={() => {
                fetcher.submit(null, { action: "/logout", method: "post" });
              }}
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" href="/join" variant="flat">
              Sign Up
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button variant="light" onClick={toggleTheme}>
              {theme === Theme.DARK ? (
                <PiSunBold className="w-5 h-5" />
              ) : (
                <PiMoonStars className="w-5 h-5" />
              )}
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Navbar>
  );
}
