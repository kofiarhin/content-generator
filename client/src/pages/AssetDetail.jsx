import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import content from '../data/uiContent.json';
import { get } from '../utils/apiClient';
import useGenerate from '../hooks/useGenerate';
import styles from './AssetDetail.module.scss';

const operations = [
  { value: 'shorten', label: 'Shorten' },
  { value: 'changeTone', label: 'Change tone' },
  { value: 'addHooks', label: 'Add hooks' }
];

const useAsset = (id) => {
  const fetchAsset = () => get(`/assets/${id}`);
  return useQuery({
    queryKey: ['asset', id],
    queryFn: fetchAsset,
    enabled: Boolean(id)
  });
};

const AssetDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const assetQuery = useAsset(id);
  const { refine } = useGenerate();
  const [operation, setOperation] = useState(operations[0].value);

  if (assetQuery.isLoading) {
    return <p>Loading asset…</p>;
  }

  if (assetQuery.isError || !assetQuery.data) {
    return <p>Asset not found.</p>;
  }

  const asset = assetQuery.data;

  const handleRefine = () => {
    refine.mutate(
      { id, operation: { type: operation } },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(['asset', id], data.asset);
        }
      }
    );
  };

  return (
    <section className={styles.asset}>
      <header>
        <h1>{asset.title}</h1>
        <p>{asset.type}</p>
      </header>
      <article>
        <pre>{asset.body}</pre>
      </article>
      {asset.cta ? <p className={styles.cta}>{asset.cta}</p> : null}
      <div className={styles.refine}>
        <label htmlFor="operation">Refine operation</label>
        <select
          id="operation"
          value={operation}
          onChange={(event) => setOperation(event.target.value)}
        >
          {operations.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={handleRefine} disabled={refine.isLoading}>
          {refine.isLoading ? 'Refining…' : content.pages.asset.ctaRefine}
        </button>
        {refine.isError ? <span className={styles.error}>Unable to refine asset.</span> : null}
      </div>
    </section>
  );
};

export default AssetDetail;
