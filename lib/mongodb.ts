
import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim() || "BazarDor";

if (!uri) {
  throw new Error("MONGODB_URI is not configured.");
}

if (!/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
  throw new Error(
    "MONGODB_URI must start with mongodb:// or mongodb+srv://."
  );
}

const globalForMongo = globalThis as typeof globalThis & {
  __bazardorMongoClient?: MongoClient;
};

export const mongoClient: MongoClient =
  (globalForMongo.__bazardorMongoClient ??= new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  }));

export const mongoDb: Db = mongoClient.db(databaseName);
