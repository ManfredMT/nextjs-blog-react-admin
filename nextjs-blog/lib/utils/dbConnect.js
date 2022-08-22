import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

const DB_NAME = process.env.DB_NAME;

if (!MONGODB_URI) {
  throw new Error(
    '请在.env.local文件里设置MONGODB_URI环境变量'
  );
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect