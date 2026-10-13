import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim() || "BazarDor";

if (uri && !/^mongodb(?:\+srv)?:\/\//i.test(uri)) {
  throw new Error("MONGODB_URI must start with mongodb:// or mongodb+srv://.");
}

const globalForMongo = globalThis as typeof globalThis & {
  __bazardorMongoClient?: MongoClient;
};

/**
 * Reuse a MongoClient during local hot reloads. In production, the module
 * cache normally keeps this instance warm between requests in the same worker.
 * If MONGODB_URI is absent, database-backed authentication is left disabled so
 * that the public catalog can still be built and viewed during setup.
 */
export const mongoClient: MongoClient | null = uri
  ? process.env.NODE_ENV !== "production"
    ? (globalForMongo.__bazardorMongoClient ??= new MongoClient(uri))
    : new MongoClient(uri)
  : null;

export const mongoDb: Db | null = mongoClient
  ? mongoClient.db(databaseName)
  : null;
