import type { NextConfig } from "next";

// Con ENV=LOCAL las imágenes salen de este servidor (DNS de Cloudflare caído); ver lib/utils/image-host.ts.
const localImages =
  process.env.ENV === "LOCAL"
    ? [new URL(process.env.LOCAL_IMAGE_ORIGIN ?? "http://194.163.133.153:7000")]
    : [];

const nextConfig: NextConfig = {
  // Los lugares viven dentro de cada mundo: el antiguo listado redirige a los mundos.
  async redirects() {
    return [{ source: "/places", destination: "/worlds", permanent: true }];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.gycoding.com',
        pathname: '/**',
      },
      ...localImages.map((u) => ({
        protocol: u.protocol.replace(':', '') as 'http' | 'https',
        hostname: u.hostname,
        port: u.port,
        pathname: '/**',
      })),
    ],
  },
};

export default nextConfig;
