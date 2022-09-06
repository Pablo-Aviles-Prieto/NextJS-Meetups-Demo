import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = ({ meetupData }) => {
  return (
    <>
      <Head>
        <title>{meetupData.title}</title>
        <meta name='description' content={meetupData.description} />
      </Head>
      <MeetupDetail
        image={meetupData.image}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
      />
    </>
  );
};

export async function getStaticPaths() {
  const client = await MongoClient.connect(process.env.MONGO_DB_URI);
  const db = client.db('meetups');

  const meetupsCollection = db.collection('meetups');

  const meetups = await meetupsCollection
    .find({})
    .project({ _id: 1 })
    .toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString(), test: '123' },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = new ObjectId(context.params.meetupId);

  const client = await MongoClient.connect(process.env.MONGO_DB_URI);
  const db = client.db('meetups');

  const meetupsCollection = db.collection('meetups');

  const selectedMeetup = await meetupsCollection.findOne({ _id: meetupId });

  client.close();

  // We cant return the Obj we get from the _id of MongoDB since NextJS needs this return as JSON format. Error => `object` ("[object Object]") cannot be serialized as JSON
  return {
    props: {
      meetupData: { ...selectedMeetup, _id: context.params.meetupId },
    },
  };
}

export default MeetupDetails;
