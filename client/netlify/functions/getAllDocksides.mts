import type { Context } from "@netlify/functions";

const getAllDocksides = async (req: Request, context: Context) => {
	return new Response("Hello world!");
};

export default getAllDocksides;
