import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuthStore } from "@/models/auth-store";
import { Button } from "../ui";

interface NavConfig {
  label: string;
  href: string;
  protected?: boolean;
}

export interface IMainNav extends React.HTMLAttributes<HTMLElement> {
  navConfig: NavConfig[];
}

export function MainNav({
  className,
  navConfig,

  ...props
}: IMainNav) {
  const { logout, isAuthenticated } = useAuthStore();

  return (
    <div
      className={cn(
        "flex items-center mx-auto space-x-4 lg:space-x-6 justify-between",
        className
      )}
      {...props}
    >
      <Link href={"/"} className="flex title-font font-medium items-center">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80"
          alt="logo"
          className="w-10 h-10 text-white p-1 rounded-full border-2 border-gray-300 bg-gray-100"
          width={40}
          height={40}
        />

        <span className="ml-3 text-xl font-bold ">Ogaalkoob</span>
      </Link>
      {isAuthenticated ? (
        <div className="pl-4 space-x-4 lg:space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className=" w-[150px] p-4 md:w-[150px] lg:w-[220px] ">
                    {navConfig.map(({ label, href }, index) => (
                      <li key={index}>
                        <Link href={href} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={`${navigationMenuTriggerStyle()}`}
                          >
                            {label}
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem onClick={logout}>
                <button className={navigationMenuTriggerStyle()}>Logout</button>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      ) : (
        <Link href={"/auth/login"}>
          <Button variant={"ghost"}>Sign in</Button>
        </Link>
      )}
    </div>
  );
}
