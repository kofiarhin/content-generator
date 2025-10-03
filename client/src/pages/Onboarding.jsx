import { useEffect, useMemo, useState } from 'react';
import useProfile from '../hooks/useProfile';
import content from '../data/uiContent.json';
import styles from './Onboarding.module.scss';

const defaultForm = {
  niche: '',
  audience: '',
  primaryChannels: '',
  brandVoice: '',
  goals: '',
  constraints: '',
  length: '',
  readingLevel: 'Year 8–9',
  ctaStyle: 'soft nudge → subscribe & save',
  keywords: ''
};

const splitValue = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const Onboarding = () => {
  const { profileQuery, saveProfile } = useProfile();
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (profileQuery.data) {
      const profile = profileQuery.data;
      setForm({
        niche: profile.niche || '',
        audience: profile.audience || '',
        primaryChannels: (profile.primaryChannels || []).join(', '),
        brandVoice: profile.brandVoice || '',
        goals: (profile.goals || []).join(', '),
        constraints: (profile.constraints || []).join(', '),
        length: profile.contentPreferences?.length || '',
        readingLevel: profile.contentPreferences?.readingLevel || 'Year 8–9',
        ctaStyle: profile.contentPreferences?.ctaStyle || 'soft nudge → subscribe & save',
        keywords: (profile.contentPreferences?.keywords || []).join(', ')
      });
    }
  }, [profileQuery.data]);

  const isSaving = saveProfile.isLoading;

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      niche: form.niche,
      audience: form.audience,
      primaryChannels: splitValue(form.primaryChannels),
      brandVoice: form.brandVoice,
      contentPreferences: {
        length: form.length,
        readingLevel: form.readingLevel,
        ctaStyle: form.ctaStyle,
        keywords: splitValue(form.keywords)
      },
      goals: splitValue(form.goals),
      constraints: splitValue(form.constraints)
    };

    saveProfile.mutate(payload);
  };

  const tips = useMemo(() => content.pages.onboarding.tips, []);

  return (
    <section className={styles.onboarding}>
      <header>
        <h1>{content.pages.onboarding.title}</h1>
        <p>{content.pages.onboarding.subtitle}</p>
      </header>
      <div className={styles.grid}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="niche">Niche</label>
          <input id="niche" value={form.niche} onChange={handleChange('niche')} required />

          <label htmlFor="audience">Audience</label>
          <input
            id="audience"
            value={form.audience}
            onChange={handleChange('audience')}
            required
          />

          <label htmlFor="primaryChannels">Primary channels (comma separated)</label>
          <input
            id="primaryChannels"
            value={form.primaryChannels}
            onChange={handleChange('primaryChannels')}
            placeholder="YouTube, Instagram"
          />

          <label htmlFor="brandVoice">Brand voice</label>
          <input
            id="brandVoice"
            value={form.brandVoice}
            onChange={handleChange('brandVoice')}
            placeholder="friendly, punchy, practical"
          />

          <label htmlFor="goals">Goals (comma separated)</label>
          <input id="goals" value={form.goals} onChange={handleChange('goals')} />

          <label htmlFor="constraints">Constraints (comma separated)</label>
          <input
            id="constraints"
            value={form.constraints}
            onChange={handleChange('constraints')}
          />

          <label htmlFor="length">Preferred length</label>
          <input id="length" value={form.length} onChange={handleChange('length')} />

          <label htmlFor="readingLevel">Reading level</label>
          <input
            id="readingLevel"
            value={form.readingLevel}
            onChange={handleChange('readingLevel')}
          />

          <label htmlFor="ctaStyle">CTA style</label>
          <input id="ctaStyle" value={form.ctaStyle} onChange={handleChange('ctaStyle')} />

          <label htmlFor="keywords">Keywords (comma separated)</label>
          <input id="keywords" value={form.keywords} onChange={handleChange('keywords')} />

          <button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving…' : content.pages.onboarding.submit}
          </button>
          {saveProfile.isSuccess ? <span className={styles.success}>Profile saved.</span> : null}
          {saveProfile.isError ? <span className={styles.error}>Failed to save profile.</span> : null}
        </form>
        <aside className={styles.sidebar}>
          <h2>Tips</h2>
          <ul>
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
};

export default Onboarding;
