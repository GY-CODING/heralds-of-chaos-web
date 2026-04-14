import { MongoClient, Db, MongoClientOptions } from "mongodb";

/**
 * Valida que las variables de entorno necesarias estén configuradas
 */
function validateEnvironment(): void {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not defined");
  }
}

/**
 * Configuración de la conexión
 */
const MONGODB_CONFIG: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
};

/**
 * Cache de la conexión a MongoDB
 */
interface MongoConnection {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<{ client: MongoClient; db: Db }> | null;
}

declare global {
  var mongoConnection: MongoConnection | undefined;
}

const cached: MongoConnection = global.mongoConnection ?? {
  client: null,
  db: null,
  promise: null,
};

if (!global.mongoConnection) {
  global.mongoConnection = cached;
}

/**
 * Conecta a MongoDB y retorna el cliente y la base de datos
 * Implementa singleton pattern para reutilizar la conexión
 */
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  validateEnvironment();

  if (cached.client && cached.db) {
    return { client: cached.client, db: cached.db };
  }

  if (!cached.promise) {
    const uri = process.env.MONGO_URI!;
    const dbName = "HeraldsOfChaos";

    cached.promise = MongoClient.connect(uri, MONGODB_CONFIG).then((client) => {
      const db = client.db(dbName);
      return { client, db };
    });
  }

  try {
    const { client, db } = await cached.promise;
    cached.client = client;
    cached.db = db;
    return { client, db };
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

/**
 * Obtiene la instancia de la base de datos
 */
export async function getDatabase(): Promise<Db> {
  const { db } = await connectToDatabase();
  return db;
}

/**
 * Cierra la conexión a MongoDB
 * Útil para testing y cleanup
 */
export async function closeConnection(): Promise<void> {
  if (cached.client) {
    await cached.client.close();
    cached.client = null;
    cached.db = null;
    cached.promise = null;
  }
}
