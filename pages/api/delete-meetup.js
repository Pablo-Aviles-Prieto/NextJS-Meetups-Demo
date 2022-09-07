import { MongoClient, ObjectId } from 'mongodb';

// URL for this endpoint => /api/new-meetup
// Since in this endpoint we just want to handle post requests from the form in NewMeetupForm.js, we look for the post requests in this endpoint using req.method() (to know which method was used to send the request).
async function handler(req, res) {
  if (req.method === 'DELETE') {
    const data = req.body;

    const client = await MongoClient.connect(process.env.MONGO_DB_URI);
    const db = client.db('meetups');
    const meetupsCollection = db.collection('meetups');
    const mongoId = new ObjectId(data.id);

    const result = await meetupsCollection.deleteOne({ _id: mongoId });

    client.close();

    res.status(201).json(result);
  }
}

export default handler;
