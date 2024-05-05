import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <>
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
    </>
  );
}
