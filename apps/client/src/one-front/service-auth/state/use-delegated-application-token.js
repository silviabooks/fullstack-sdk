/**
 * This strategy is supposed to store/rerieve an AT from BrowserStorage
 * and run a refresh of the token against the API that delegated it.
 *
 * @returns
 */

// import { useGetConfig } from "@forrestjs/core";

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
  const at = new BrowserStorage("at");

  /**
   * It retrieves the Application Token by:
   * - validating a Delegated Token against the Authorization Authority
   * - retrieving the previously persisted Application Token
   *
   * @returns String Application Token
   */
  const get = async () => {
    // LOOOT TO DO HERE
    return at.get();
  };

  /**
   * Persist an Application Token
   * @param String Application Token
   * @returns
   */
  const set = async (token) => {
    return token ? at.set(token) : at.delete();
  };

  /**
   * Uses JWT wizardry to validate the Application Token locally.
   * It should throw if the token not valid.
   * @param String Application Token
   */
  const verify = async (token) => {
    console.log("verify AT");
  };

  /**
   *
   * @param String Application Token (old)
   * @returns String Application Token (new)
   */
  const refresh = async (token) => {
    console.log("refresh AT");
    return token;
  };

  return {
    get,
    set,
    verify,
    refresh
  };
};
