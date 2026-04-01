/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"randomuser.me"
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
