/**
 * This strategy is supposed to store/rerieve an AT from BrowserStorage
 * and run a refresh of the token against the API that delegated it.
 *
 * @returns
 */

import { useGetConfig } from "@forrestjs/react-root";
import useQueryString from "use-query-string";

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

export const useDelegatedApplicationToken = () => {
  const tokenParam = useGetConfig("oneFront.auth.token.param", "token");
  const tokenStorageKey = useGetConfig("oneFront.auth.token.storage.key", "at");

  const [queryString, setQuery] = useQueryString(window.location, (path) => {
    window.history.pushState(null, document.title, path);
  });

  const storage = new BrowserStorage(tokenStorageKey);
  const dt = queryString[tokenParam];

  /**
   * Persist an Application Token
   * @param String Application Token
   * @returns
   */
  const set = async (token) => {
    return token ? storage.set(token) : storage.delete();
  };

  /**
   * It retrieves the Application Token by:
   * - validating a Delegated Token against the Authorization Authority
   * - retrieving the previously persisted Application Token
   *
   * @returns String Application Token
   */
  const get = async () => {
    // Attempt to load an existing AccessToken
    if (!dt) {
      return storage.get();
    }

    // Remove token from url as soon as possible
    setQuery({ ...queryString, token: null });

    // Refresh a DelegateToken
    throw new Error("DelegateToken @ not yet implemented");
  };

  /**
   * Uses JWT wizardry to validate the Application Token locally.
   * It should throw if the token not valid.
   * @param String Application Token
   */
  const verify = async (token) => {
    throw new Error("ApplicationToken @verification@ not yet implemented");
  };

  /**
   *
   * @param String Application Token (old)
   * @returns String Application Token (new)
   */
  const refresh = async (token) => {
    throw new Error("ApplicationToken @refresh@ not yet implemented");
  };

  return {
    get,
    set,
    verify,
    refresh
  };
};
