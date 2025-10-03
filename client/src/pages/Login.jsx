import { useState } from 'react';
import content from '../data/uiContent.json';
import styles from './Login.module.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setStatus('Please enter an email address.');
      return;
    }
    setStatus('Magic link sent. Check your inbox.');
  };

  return (
    <section className={styles.login}>
      <header>
        <h1>{content.pages.login.title}</h1>
        <p>{content.pages.login.subtitle}</p>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
        />
        <button type="submit">{content.pages.login.cta}</button>
        {status ? <span className={styles.status}>{status}</span> : null}
      </form>
    </section>
  );
};

export default Login;
