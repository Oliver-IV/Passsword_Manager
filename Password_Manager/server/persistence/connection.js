import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({path: "../.env"}) ;

const connectionString = process.env.CONNECTION_STRING ;

const client = new MongoClient(connectionString);

export default client ;