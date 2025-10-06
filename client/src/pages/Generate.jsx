import { useState, useEffect } from "react";
import ResultCard from "../components/ResultCard";
import useGenerate from "../hooks/useGenerate";
import content from "../data/uiContent.json";
import styles from "./Generate.module.scss";
import { baseUrl } from "../constants/constants";

const channels = [
  "youtube_idea",
  "youtube_script",
  "reel_hook",
  "carousel",
  "blog_outline",
  "email_newsletter",
];

const tones = ["casual", "friendly", "motivational", "trust-building"];

const Generate = () => {
  const { generate } = useGenerate();
  const [form, setForm] = useState({
    type: channels[0],
    tone: "casual",
    wordsTarget: 250,
  });
  const [results, setResults] = useState([]);

  // health check
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      console.log(res.ok);
    };

    getData();
  }, []);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]:
        field === "wordsTarget"
          ? Number(event.target.value)
          : event.target.value,
    }));
  };

  const handleGenerate = (event) => {
    event.preventDefault();
    generate.mutate(form, {
      onSuccess: (data) => {
        const assets = data.assets?.length
          ? data.assets
          : data.response?.assets || [];
        const mapped = assets.map((asset) => ({
          id: asset._id || asset.id,
          title: asset.title,
          body: asset.body,
          cta: asset.cta,
          tags: asset.tags,
          type: asset.type || data.response?.meta?.type || form.type,
        }));
        setResults(mapped);
      },
    });
  };

  const handleCopy = async (asset) => {
    await navigator.clipboard.writeText(asset.body);
  };

  const handleDownload = (asset) => {
    const blob = new Blob([`# ${asset.title}\n\n${asset.body}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${asset.title}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className={styles.generate}>
      <header>
        <h1>{content.pages.generate.title}</h1>
        <p>{content.pages.generate.subtitle}</p>
      </header>
      <form className={styles.form} onSubmit={handleGenerate}>
        <label htmlFor="type">Channel</label>
        <select id="type" value={form.type} onChange={handleChange("type")}>
          {channels.map((channel) => (
            <option key={channel} value={channel}>
              {channel}
            </option>
          ))}
        </select>

        <label htmlFor="tone">Tone</label>
        <select id="tone" value={form.tone} onChange={handleChange("tone")}>
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>

        <label htmlFor="wordsTarget">Words target</label>
        <input
          id="wordsTarget"
          type="number"
          value={form.wordsTarget}
          min={120}
          max={800}
          onChange={handleChange("wordsTarget")}
        />

        <button type="submit" disabled={generate.isLoading}>
          {generate.isLoading ? "Generating…" : content.pages.generate.cta}
        </button>
      </form>

      <div className="tontent">
        {generate?.data && generate.data?.content && (
          <p> {generate?.data.content} </p>
        )}
      </div>

      {/* <div className={styles.results}>
        {results.map((asset) => (
          <ResultCard
            key={asset.id}
            asset={asset}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onFavorite={() => {}}
            onRefine={() => {}}
          />
        ))}
      </div> */}
    </section>
  );
};

export default Generate;
