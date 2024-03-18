/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				'hostname': "third-beagle-273.convex.cloud"			
			}
		]
	}
};

export default nextConfig;
