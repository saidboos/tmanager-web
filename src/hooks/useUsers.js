import { useEffect, useRef, useState } from "react";
import { fetchUsers } from "../api/users";

export function useUsers({ enabled = true } = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const didRun = useRef(false);

  const refetch = async () => {
    setLoading(true);
    try {
      const payload = await fetchUsers();

      // payload may be an array OR { items, total }; handle both
      setUsers(Array.isArray(payload) ? payload : payload.items ?? []);
    } catch (err) {
      console.log("users data", err.response.data);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     refetch();
  //   }, []);

  useEffect(() => {
    if (!enabled) return;
    if (didRun.current) return; // <-- prevents StrictMode double-run
    didRun.current = true;
    refetch();
  }, [enabled]);

  return { users, loading, error, refetch };
}
