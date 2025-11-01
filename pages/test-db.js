import { useState, useEffect } from 'react';

export default function TestDB() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('/api/test-connection');
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) return <div>Testing database connection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      {result ? (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">
            {result.success ? '✅ Success!' : '❌ Error'}
          </h2>
          <p className="mb-4">{result.message}</p>
          
          {result.collections && (
            <div>
              <h3 className="font-semibold mb-2">Collections:</h3>
              <ul className="list-disc pl-5">
                {result.collections.map((collection, index) => (
                  <li key={index}>{collection}</li>
                ))}
              </ul>
            </div>
          )}
          
          {result.error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
              <h3 className="font-semibold">Error Details:</h3>
              <pre className="whitespace-pre-wrap mt-2">
                {JSON.stringify(result.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div>No response from server</div>
      )}
    </div>
  );
}
