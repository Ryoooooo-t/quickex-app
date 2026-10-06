import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開発中のスマホ実機確認（HMR）を許可
  allowedDevOrigins: ['192.168.0.19', '127.0.0.1', 'localhost'],
};

export default nextConfig;
