import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // 빌드 시 ESLint 검사를 실행하지만 경고나 오류가 있어도 빌드를 중단하지 않음
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
