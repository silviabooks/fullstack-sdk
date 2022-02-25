import { useGetConfig, useGetContext } from "@forrestjs/react-root";
import { createContext, useEffect, useState } from "react";

const USE_APPLICATION_TOKEN = "one.auth.strategy.useApplicationToken.hook";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // The application token offers a strategy for retrivial and refresh
  // the strategy itself is replaceable via hooks
  const useApplicationToken = useGetContext(USE_APPLICATION_TOKEN);
  const at = useApplicationToken();

  // Internal state:
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Feature flags:
  const verifyToken = useGetConfig("one.auth.verifyToken", false);
  const refreshToken = useGetConfig("one.auth.refreshToken", true);
  const keepAlive = Number(useGetConfig("one.auth.keepAlive", 15000));

  // Grant access to the App
  // (boot time Access Token lifecycle)
  useEffect(() => {
    (async () => {
      let token = null;

      // Get AT
      try {
        token = await at.get();

        // No token found and no session means there is
        // to way to log in the poor bastard.
        if (!token) {
          setLoading(false);
          return;
        }

        setToken(token);
      } catch (err) {
        setError(err);
        setLoading(false);
        return;
      }

      // Verify AT
      if (verifyToken) {
        try {
          await at.verify(token);
        } catch (err) {
          setError(err);
          setLoading(false);
          return;
        }
      }

      // Refresh AT
      if (refreshToken) {
        try {
          token = await at.refresh(token);
          setToken(token);
        } catch (err) {
          setError(err);
          setLoading(false);
          return;
        }
      }

      // Start background refresh
      if (keepAlive > 0) {
        let ticker = null;

        const loop = async () => {
          clearTimeout(ticker);

          try {
            token = await at.refresh(token);
            setToken(token);
          } catch (err) {
            setError(err);
            setLoading(false);
            return;
          }

          ticker = setTimeout(loop, keepAlive);
        };

        // Kick the ticker
        ticker = setTimeout(loop, keepAlive);
      }

      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        isPublic: token === null,
        token,
        setToken: async (token) => {
          try {
            await at.set(token);
            setToken(token);
          } catch (err) {
            setError(err);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
