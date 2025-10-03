import PropTypes from 'prop-types';
import content from '../data/uiContent.json';
import styles from './ResultCard.module.scss';

const ResultCard = ({ asset, onCopy, onDownload, onFavorite, onRefine }) => (
  <article className={styles.card}>
    <header className={styles.header}>
      <div>
        <h3>{asset.title}</h3>
        <span className={styles.type}>{asset.type}</span>
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={() => onCopy(asset)}>
          {content.pages.asset.ctaCopy}
        </button>
        <button type="button" onClick={() => onDownload(asset)}>
          {content.pages.asset.ctaDownload}
        </button>
        <button type="button" onClick={() => onFavorite(asset)}>
          {content.pages.asset.ctaFavorite}
        </button>
        <button type="button" onClick={() => onRefine(asset)}>
          {content.pages.asset.ctaRefine}
        </button>
      </div>
    </header>
    <section className={styles.body}>
      <pre>{asset.body}</pre>
    </section>
    {asset.cta ? <footer className={styles.footer}>{asset.cta}</footer> : null}
    {asset.tags?.length ? (
      <ul className={styles.tags}>
        {asset.tags.map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
    ) : null}
  </article>
);

ResultCard.propTypes = {
  asset: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    type: PropTypes.string,
    body: PropTypes.string,
    cta: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onCopy: PropTypes.func,
  onDownload: PropTypes.func,
  onFavorite: PropTypes.func,
  onRefine: PropTypes.func
};

ResultCard.defaultProps = {
  onCopy: () => {},
  onDownload: () => {},
  onFavorite: () => {},
  onRefine: () => {}
};

export default ResultCard;
