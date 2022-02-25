import { useMemo } from "react";
import useQueryString from "use-query-string";
import { useGetConfig } from "@forrestjs/react-root";

export const useEmbed = () => {
  const [qs] = useQueryString(window.location, () => {});
  const urlKey = useGetConfig("one.layout.embed.param.key", "embed");
  const storageKey = useGetConfig("one.layout.embed.storage.key", "embed");

  const isEmbed = useMemo(() => {
    // Use existing session setting
    if (qs.embed === undefined || qs.embed === "") {
      console.log("use");
      return Boolean(sessionStorage.getItem(storageKey));
    }

    // Set the info to session storage for the lifetime of the setting.
    if (["false", "no", "0", "-1"].includes(qs.embed)) {
      sessionStorage.removeItem(urlKey);
      return false;
    } else {
      sessionStorage.setItem(urlKey, true);
      return true;
    }
  }, []);

  return {
    isEmbed
  };
};
