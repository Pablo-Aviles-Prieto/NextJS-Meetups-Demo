import { useRouter } from 'next/router';

import styles from './MeetupDetail.module.css';

const MeetupDetail = (props) => {
  const router = useRouter();

  const deleteMeetupHandler = async () => {
    const response = await fetch('/api/delete-meetup', {
      method: 'DELETE',
      body: JSON.stringify({ id: props.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    router.push('/');
  };

  return (
    <section className={styles.detail}>
      <img src={props.image} alt={props.title} />
      <h1>{props.title}</h1>
      <address>{props.address}</address>
      <p>{props.description}</p>
      <div className={styles.actions}>
        <button onClick={deleteMeetupHandler}>Delete Meetup</button>
      </div>
    </section>
  );
};

export default MeetupDetail;
