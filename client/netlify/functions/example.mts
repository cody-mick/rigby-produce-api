import { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
	const { city, country } = context.params;
	return new Response(`You're visiting ${city} in ${country}!`);
};

export const config: Config = {
	path: "/api/locations/:city/:country",
};
