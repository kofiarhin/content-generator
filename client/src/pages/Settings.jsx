import { useState } from 'react';
import content from '../data/uiContent.json';
import styles from './Settings.module.scss';

const Settings = () => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('groqKey') || '');
  const [status, setStatus] = useState('');

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem('groqKey', apiKey);
    setStatus('Settings saved.');
  };

  return (
    <section className={styles.settings}>
      <header>
        <h1>{content.pages.settings.title}</h1>
        <p>{content.pages.settings.subtitle}</p>
      </header>
      <form className={styles.form} onSubmit={handleSave}>
        <label htmlFor="groqKey">{content.pages.settings.apiLabel}</label>
        <input
          id="groqKey"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          placeholder="sk-..."
        />
        <button type="submit">{content.pages.settings.save}</button>
        {status ? <span className={styles.status}>{status}</span> : null}
      </form>
    </section>
  );
};

export default Settings;
