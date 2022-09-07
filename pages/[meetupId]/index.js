import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

import MeetupDetail from '../../components/meetups/MeetupDetail';

const MeetupDetails = ({ meetupData }) => {
  const notFound = meetupData.title.includes('404');

  return (
    <>
      <Head>
        <title>{meetupData.title}</title>
        <meta name='description' content={meetupData.description} />
      </Head>
      <MeetupDetail
        image={!notFound ? meetupData.image : ''}
        title={meetupData.title}
        address={meetupData.address}
        description={meetupData.description}
        id={meetupData._id}
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
    fallback: 'blocking',
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const mongoDbRegex = /^[a-f\d]{24}$/i;

  if (!mongoDbRegex.test(context.params.meetupId)) {
    return {
      props: {
        meetupData: {
          title: '404 Not found',
          description: `Can't found the specified resource. Check the URL and try again in a few moments!`,
        },
      },
    };
  }
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
