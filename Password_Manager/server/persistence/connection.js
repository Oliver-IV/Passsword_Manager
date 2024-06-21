import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config() ;

const connectionString = process.env.CONNECTION_STRING ;

console.log(connectionString) ;

const client = new MongoClient(connectionString);

export default client ;