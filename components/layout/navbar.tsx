/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsdoc/require-returns */
"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import classnames from "classnames";
import { useSignInModal } from "./sign-in-modal";
import UserDropdown from "./user-dropdown";
import { useZustand } from "@/lib/store/use-zustand";
import { MENUS, WITHOUT_SIGN } from "@/lib/constants";

/**
 *
 */
export default function NavBar({ session }: { session: Session | null }) {
  // eslint-disable-next-line no-unused-vars
  const { SignInModal, setShowSignInModal } = useSignInModal();
  const scrolled = useScroll(50);
  const { selMenu, setSelMenu, isUser } = useZustand();

  useEffect(() => {
    console.log("NavBar#useEffect: session: ", session);
  }, [session]);

  return (
    <>
      <SignInModal />
      <div
        className={`fixed top-0 flex w-full justify-center ${
          scrolled
            ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
            : "bg-white/0"
        } z-30 transition-all`}
      >
        <div className="mx-5 flex h-16 w-full max-w-screen-xl items-center justify-between">
          <div className="flex items-center gap-4">
            {selMenu !== MENUS.dashboard.toLocaleLowerCase() && [
              <Link
                href="/"
                className="flex items-center font-display text-2xl"
                key="precedent"
              >
                <Image
                  src="/logo.png"
                  alt="Precedent logo"
                  width="30"
                  height="30"
                  className="mr-2 rounded-sm"
                />
                <p>Precedent</p>
              </Link>,
              ((session && isUser) || WITHOUT_SIGN) &&
                Object.keys(MENUS).map((menuKey, idx) => (
                  <div
                    key={idx}
                    className={classnames({
                      "cursor-pointer text-xl hover:text-black": true,
                      "text-black": selMenu === menuKey,
                      "text-gray-500": selMenu !== menuKey,
                    })}
                    onClick={() => {
                      setSelMenu(menuKey);
                    }}
                  >
                    {MENUS[menuKey]}
                  </div>
                )),
            ]}
          </div>
          <div>
            {session && isUser ? (
              <UserDropdown session={session} />
            ) : (
              <button
                className="rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
