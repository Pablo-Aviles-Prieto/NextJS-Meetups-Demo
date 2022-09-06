import { MongoClient } from 'mongodb';

// URL for this endpoint => /api/new-meetup
// Since in this endpoint we just want to handle post requests from the form in NewMeetupForm.js, we look for the post requests in this endpoint using req.method() (to know which method was used to send the request).
async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;

    const client = await MongoClient.connect(process.env.MONGO_DB_URI);

    // Name for the DB
    const db = client.db('meetups');

    // Name for the collection
    const meetupsCollection = db.collection('meetups');

    // insertOne expects an obj, and data comes as an obj.
    const result = await meetupsCollection.insertOne(data);

    // Close the connection stablished to the DB
    client.close();

    res.status(201).json({ message: 'Meetup inserted!' });
  }
}

export default handler;
