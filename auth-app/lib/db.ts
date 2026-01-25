import mongoose from "mongoose";

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

// Use cached global
const cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
