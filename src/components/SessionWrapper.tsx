"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

export default function SessionWrapper({ children }: any) {
  return <SessionProvider>{children}</SessionProvider>;
}
