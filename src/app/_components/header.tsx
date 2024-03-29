import Image from "next/image";
import Link from "next/link";
import { FaUserPlus as UserPlus } from "react-icons/fa6";

import { auth } from "@/server/auth";

import { MenutreeWithNoBackground } from "./icons";
import { User } from "./user";
import { Button } from "@/components/ui/button";

export async function Header() {
  const session = await auth();

  return (
    <div className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 w-full max-w-screen-2xl items-center px-6">
        <div className="flex w-full items-center justify-between">
          <Link href="/">
            <MenutreeWithNoBackground className="size-7" />
          </Link>

          {!session?.user ? (
            <Button className="gap-2" variant="default" asChild>
              <Link href="/auth">
                <UserPlus className="size-4" />
                Sign In
              </Link>
            </Button>
          ) : (
            <User />
          )}
        </div>
      </div>
    </div>
  );
}
