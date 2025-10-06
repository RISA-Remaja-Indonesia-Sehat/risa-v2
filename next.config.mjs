/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.icons8.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'logos-world.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'assets.tokopedia.net',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
