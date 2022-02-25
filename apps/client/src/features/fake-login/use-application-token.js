import useQueryString from "use-query-string";
import axios from "axios";

class BrowserStorage {
  constructor(key) {
    this.key = key;
  }

  get() {
    return localStorage.getItem(this.key);
  }

  set(val) {
    localStorage.setItem(this.key, val);
    return true;
  }

  delete() {
    localStorage.removeItem(this.key);
    return true;
  }
}

export const useApplicationToken = () => {
  const [queryString, setQuery] = useQueryString(window.location, (path) => {
    window.history.pushState(null, document.title, path);
  });

  const storage = new BrowserStorage("fake-at");
  const dt = queryString["token"];

  // This stuff should come from environment
  const introspectUrl = "http://localhost:4040/v1/token/introspect";
  const refreshUrl = "http://localhost:4040/v1/token/refresh";

  const set = (token) => (token ? storage.set(token) : storage.delete());

  const get = async () => {
    if (!dt) {
      return storage.get();
    }

    // Remove token from url as soon as possible
    setQuery({ ...queryString, token: null });

    // Refresh a DelegateToken
    // -> send DT via headers
    const res = await axios.post(
      refreshUrl,
      {},
      {
        headers: { "x-refresh-token": dt },
        withCredentials: true
      }
    );

    // Persist the token and return it
    const { applicationToken } = res.data;
    set(applicationToken);

    return applicationToken;
  };

  const refresh = async () => {
    // Send current RT via cookies
    const res = await axios.post(refreshUrl, {}, { withCredentials: true });

    // Persist the token and return it
    const { applicationToken } = res.data;
    set(applicationToken);

    return applicationToken;
  };

  // Introspects the token
  // (with automatic fallback on refresh)
  const verify = async (token) => {
    try {
      const res = await axios.post(introspectUrl, { applicationToken: token });
      return res.data;
    } catch (err) {
      const token = await refresh();
      const res = await axios.post(introspectUrl, { applicationToken: token });
      return res.data;
    }
  };

  return {
    get,
    set,
    verify,
    refresh
  };
};
