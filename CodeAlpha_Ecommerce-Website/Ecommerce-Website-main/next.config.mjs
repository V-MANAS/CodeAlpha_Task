// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images: {
//         remotePatterns: [
//             {
//                 protocol: 'https',
//                 hostname: 'res.cloudinary.com',
//                 pathname: '**',
//             },
//             {
//                 protocol: 'https',
//                 hostname: 'raw.githubusercontent.com',
//                 pathname: '**',
//             },
//         ],
//     },
// };

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {},
  },
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "res.cloudinary.com",
    },
  ],
},

};

export default nextConfig;




