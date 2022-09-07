import Head from 'next/head.js';
// We can import MongoClient here even if its only used in the getStaticProps Fn for pre-rendering
import { MongoClient } from 'mongodb';

import MeetupList from '../components/meetups/MeetupList.js';

const HomePage = (props) => {
  return (
    <>
      <Head>
        <title>NextJS Meetups by Pablo Avilés</title>
        <meta
          name='description'
          content='Browse a huge list of meetups everywhere around the world (even in other planets)'
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
};

export async function getStaticProps() {
  // Since this is part of the server-side of NextJS, we can run the connection and queries to the DB just here, instead of creating a API endoint in the api folder, to get a concrete obj from DB.
  const client = await MongoClient.connect(process.env.MONGO_DB_URI);
  const db = client.db('meetups');

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection.find().toArray();

  client.close();

  // In the props we want to map the meetup array we get from mongoDB, to change the id we get from meetup._id to just id, and also, sintrifying the ObjectId('') we get in Mongo as ID.
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
