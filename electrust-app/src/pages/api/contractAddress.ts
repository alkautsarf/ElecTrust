import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = new MongoClient(process.env.NEXT_PUBLIC_MONGODB_URI as string);
  try {
    await client.connect();
    const database = client.db('electrust'); 
    const collection = database.collection('contracts'); 

    if (req.method === 'POST') {
      const { contractAddress, owner } = req.body;


      await collection.insertOne({ contractAddress, owner });

      res.status(201).json({ message: 'Data saved successfully!' });
    } else if (req.method === 'GET') {
      const data = await collection.find().toArray();
      res.status(200).json(data);
    } else {
      res.status(405).json({ message: 'Method not allowed!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong!' });
  } finally {
    await client.close();
  }
}
