import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import useAssets from '../hooks/useAssets';
import content from '../data/uiContent.json';
import styles from './Library.module.scss';

const Library = () => {
  const navigate = useNavigate();
  const { assetsQuery, toggleFavorite } = useAssets({ page: 1, limit: 20 });

  const assets = assetsQuery.data?.items ?? [];

  const handleCopy = async (asset) => {
    await navigator.clipboard.writeText(asset.body);
  };

  const handleDownload = (asset) => {
    const blob = new Blob([`# ${asset.title}\n\n${asset.body}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${asset.title}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleFavorite = (asset) => {
    toggleFavorite.mutate(asset.id);
  };

  const emptyState = useMemo(() => content.pages.library.empty, []);

  return (
    <section className={styles.library}>
      <header>
        <h1>{content.pages.library.title}</h1>
        <p>{content.pages.library.subtitle}</p>
      </header>
      {assetsQuery.isLoading ? <p>Loading library…</p> : null}
      {assetsQuery.isError ? <p>Unable to load assets.</p> : null}
      {!assetsQuery.isLoading && assets.length === 0 ? <p>{emptyState}</p> : null}
      <div className={styles.results}>
        {assets.map((item) => (
          <ResultCard
            key={item._id}
            asset={{
              id: item._id,
              title: item.title,
              body: item.body,
              cta: item.cta,
              tags: item.tags,
              type: item.type
            }}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onFavorite={handleFavorite}
            onRefine={() => navigate(`/asset/${item._id}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default Library;
