import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:5001";

export function useWebsiteSettings(section) {
  const [data, setData]       = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/website-settings/${section}`);
        if (res.data.success) setData(res.data.data || {});
      } catch (err) {
        console.error(`Settings fetch error [${section}]:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [section]);

  return { data, loading };
}