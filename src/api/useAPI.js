import { useState, useCallback } from 'react';

const useAPI = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (url, method, body) => {
    console.log('Fetching data from:', url);
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      console.log('Result', result);
      if (result.error_code === 0) {
        console.log('Data:', result.data);
        setData(result.data);
      } else {
        setError(new Error(result.message));
        console.error('Error:', result.message);
      }
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

export default useAPI;
