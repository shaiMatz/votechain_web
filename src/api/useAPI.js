import { useState, useCallback } from 'react';

const useAPI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, method, body) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      setData(result);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default useAPI;
