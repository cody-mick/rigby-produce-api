import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const uri = process.env.MONGODB_URI || "";

const connectToDatabase = async (client: any) => {
	try {
		await client.connect();
		console.log("Connected to database");
		return client.db("test");
	} catch (err) {
		console.log("Error connecting to database: ", err);
	}
};

export default connectToDatabase;
