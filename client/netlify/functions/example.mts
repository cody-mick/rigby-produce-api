import { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
	return new Response("Example netlify function!");
};
