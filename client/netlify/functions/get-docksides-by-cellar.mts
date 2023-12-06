import { Context } from "@netlify/functions";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(Netlify.env.get("MONGODB_URI") || "");

const clientPromise = mongoClient.connect();

export default async (event, req: Request, context: Context) => {
	const queryString = event.queryStringParameters || "00000";
	const cellarId = queryString.cellarId;
	const client = await clientPromise;
	const db = client.db("rigby_produce_dev");
	const docksidesCollection = db.collection("docksides");
	const docksides = await docksidesCollection
		.find({
			cellarId: cellarId,
		})
		.toArray();
	return new Response(JSON.stringify(docksides));
};
