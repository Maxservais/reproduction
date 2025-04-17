import { useState } from "react";
import "../app.css";

interface ResultData {
  method: "Direct HTTP" | "Service Binding";
  data: any;
}

function App() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const testDirectHttp = async () => {
    setLoading(true);
    setError(null);
    try {
      // Direct HTTP call to backend
      const response = await fetch("http://localhost:8787/test-db");
      const data = await response.json();
      setResult({ method: "Direct HTTP", data });
    } catch (err: unknown) {
      setError(
        `HTTP Error: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testServiceBinding = async () => {
    setLoading(true);
    setError(null);
    try {
      // Call through the worker's fetch handler which uses service binding
      const response = await fetch("/api/test-db");
      const data = await response.json();
      setResult({ method: "Service Binding", data });
    } catch (err: unknown) {
      setError(
        `Service Binding Error: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card flex flex-col gap-4">
        <button onClick={testDirectHttp} disabled={loading}>
          Test Direct HTTP
        </button>
        <button onClick={testServiceBinding} disabled={loading}>
          Test Service Binding
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <h2>Result from {result.method}</h2>
          <pre>{JSON.stringify(result.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
