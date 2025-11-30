import React, { useState } from "react";
import { fetchQuery } from "./api/query";
import GenieHeader from "./components/GenieHeader";
import ResultsTable from "./components/ResultsTable";
import DataSection from "./components/DataSection";
import "./styles.css";

export default function App() {
  console.log("ENV:", import.meta.env.VITE_API_URL);
  const [question, setQuestion] = useState("Show total revenue per genre");
  const [sql, setSql] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (queryOverride) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchQuery(queryOverride ?? question);
      setSql(data.sql);
      setResults(data.results);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const runExample = (example) => {
    setQuestion(example);
    handleSubmit(example);
  };

  return (
    <>
      <div className="layout">
        <div className="container">
          <GenieHeader />

          <input
            type="text"
            className="query-input"
            placeholder="What would you like to know?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button className="button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Thinking..." : "Run Query"}
          </button>

          {error && <div className="error">{error}</div>}

          {sql && (
            <>
              <h2>Generated SQL</h2>
              <pre className="sql-block">{sql}</pre>
            </>
          )}

          {results.length > 0 && <ResultsTable results={results} />}
        </div>
      </div>

      <DataSection onExampleClick={runExample} />
    </>
  );
}
