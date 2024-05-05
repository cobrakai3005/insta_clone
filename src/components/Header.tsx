"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  console.log(session);
  return (
    <nav className="shadow-sm border border-b sticky top-0 bg-white z-30 p-3">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src={"/instaLarge.png"}
            alt="insta_logo"
            width={100}
            height={100}
            className="hidden lg:inline-block"
          />
        </Link>
        <Link href={"/"}>
          <Image
            src={"/instalogo.jpg"}
            alt="insta_logo"
            width={76}
            height={76}
            className="lg:hidden w-[50px] h-[50px]"
          />
        </Link>
        {/* Search input */}

        <input
          type="text"
          placeholder="Search"
          className="bg-gray50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[240px]"
        />
        {/* menu items */}

        {session ? (
          <img
            width={56}
            height={56}
            className="rounded-full cursor-pointer"
            onClick={() => signOut()}
            src={session.user?.image || ""}
            alt={session.user?.name || ""}
          />
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm font-semibold text-blue-500"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
