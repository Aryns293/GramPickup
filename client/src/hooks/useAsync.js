import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Generic hook for fetching data from the API.
 * Handles loading, error and refetch automatically.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useAsync('/parcels/my-parcels');
 */
const useAsync = (endpoint, deps = []) => {
  const { apiFetch } = useAuth();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFetch(endpoint);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetch(); }, [fetch, ...deps]);

  return { data, loading, error, refetch: fetch };
};

export default useAsync;
