import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  // Pin the workspace root so a stray package-lock.json in the home dir is ignored.
  turbopack: { root: __dirname },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
