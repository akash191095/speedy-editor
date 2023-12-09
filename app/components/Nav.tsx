import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { Link, useFetcher } from "@remix-run/react";
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
    <Navbar maxWidth="full">
      <NavbarBrand>
        <Link to="/">
          <p className="font-bold text-inherit">SPEEDY EDITOR</p>
        </Link>
      </NavbarBrand>
      {user ? (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              color="danger"
              variant="flat"
              onClick={() => {
                fetcher.submit(null, { action: "/logout", method: "post" });
              }}
            >
              Logout
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
      ) : (
        <NavbarContent justify="end">
          <NavbarItem>
            <Link to="/login">Login</Link>
          </NavbarItem>
          <NavbarItem>
            <Button as={Link} color="primary" to="/join" variant="flat">
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
