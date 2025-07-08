// /lib/data/storage.js

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const dbName = 'compliance';
const collectionName = 'documents';

export async function saveMetadataForCompany(company, fileName, metadata) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  await collection.insertOne({ company, fileName, ...metadata, uploadedAt: new Date() });
}

export async function getExpiringDocs(company, days = 90) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  const upcoming = new Date();
  upcoming.setDate(upcoming.getDate() + days);

  return await collection.find({
    company,
    expirationDate: { $lte: upcoming },
  }).toArray();
}

export async function getAllDocsByCompany(company) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return await collection.find({ company }).toArray();
}

