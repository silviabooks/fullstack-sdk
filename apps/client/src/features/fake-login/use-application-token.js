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
  const at = new BrowserStorage("fake-at");
  const get = () => at.get();
  const set = (token) => (token ? at.set(token) : at.delete());
  const verify = (token) => token;
  const refresh = (token) => token;

  return {
    get,
    set,
    verify,
    refresh
  };
};
