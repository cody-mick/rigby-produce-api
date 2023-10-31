import express from "express";
import { config } from "dotenv";
import connectToDatabase from "./db";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";

const uri = process.env.MONGODB_URI || "";
const port = process.env.PORT || 8080;

// Load environment variables
config();

// Create Express server
const app = express();

// Express configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Create a new MongoClient
const client = new MongoClient(uri);

// Routes
app.get("/", (req, res) => {
	res.send("Rigby Produce API");
});

// Get all docksides
app.get("/api/docksides-all", async (req, res) => {
	const collection = client.db("rigby_produce_dev").collection("docksides");
	const docksides = await collection.find({}).toArray();
	res.json(docksides);
});

// Get one dockside by dockside ID
app.get("/api/dockside-by-id/:id", async (req, res) => {
	const collection = client.db("rigby_produce_dev").collection("docksides");
	const dockside = await collection.findOne({
		_id: new ObjectId(req.params.id),
	});
	res.json(dockside);
});

// Get all docksides with a specific cellar ID
app.get("/api/docksides-by-cellar/:cellarId", async (req, res) => {
	const collection = client.db("rigby_produce_dev").collection("docksides");
	const docksides = await collection
		.find({ cellarId: req.params.cellarId })
		.toArray();
	res.json(docksides);
});

// Get all docksides with a specified date
app.get("/api/docksides-by-date/:date", async (req, res) => {
	const collection = client.db("rigby_produce_dev").collection("docksides");
	const docksides = await collection
		.find({ date: req.params.date })
		.toArray();
	res.json(docksides);
});

// Function to start the server and connect to the database
const startServer = async () => {
	try {
		connectToDatabase();
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	} catch (err) {
		console.log("Error starting server: ", err);
	}
};

// Start the server
startServer();
