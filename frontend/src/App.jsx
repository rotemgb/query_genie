import React, { useState } from "react";
import { fetchQuery } from "./api/query";

export default function App() {
  console.log("ENV:", import.meta.env.VITE_API_URL);
  const [question, setQuestion] = useState("Show total revenue per genre");
  const [sql, setSql] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchQuery(question);
      setSql(data.sql);
      setResults(data.results);
    } catch (err) {
      setError(err.message || "Error fetching query");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>QueryGenie</h1>

      <textarea
        rows="3"
        style={{ width: "100%" }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "1rem" }}
      >
        {loading ? "Loading..." : "Run Query"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {sql && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Generated SQL:</h3>
          <pre>{sql}</pre>
        </div>
      )}

      {results.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Results:</h3>
          <table border={1} cellPadding={5} style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>{Object.keys(results[0]).map((col) => <th key={col}>{col}</th>)}</tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => <td key={i}>{val}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
