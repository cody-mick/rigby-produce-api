import { Config, Context } from "@netlify/functions";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(Netlify.env.get("MONGODB_URI") || "");

const clientPromise = mongoClient.connect();

export default async (req: Request, context: Context) => {
	const { cellarId } = context.params;
	const client = await clientPromise;
	const db = client.db("rigby_produce_dev");
	const docksidesCollection = db.collection("docksides");
	const docksides = await docksidesCollection
		.find({
			cellarId: cellarId,
		})
		.limit(15)
		.toArray();
	return new Response(JSON.stringify(docksides));
};

export const config: Config = {
	path: "/api/docksides/by-cellar/:cellarId",
};
