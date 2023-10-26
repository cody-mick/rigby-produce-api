import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const uri = process.env.MONGODB_URI || "";
export const client = new MongoClient(uri);

const connectToDatabase = async () => {
	try {
		await client.connect();
		console.log("Connected to database");
		return client.db("rigby_produce_dev");
	} catch (err) {
		console.log("Error connecting to database: ", err);
	}
};

export default connectToDatabase;
