import { useState, useEffect } from "react";
import useQueryString from "use-query-string";
import { useGetConfig } from "@forrestjs/react-root";

const navigate = (path) => window.history.pushState(null, document.title, path);

const getIsEmbed = (query, urlKey, storageKey) => {
  // Use existing session setting
  if (query[urlKey] === undefined || query[urlKey] === "") {
    return Boolean(sessionStorage.getItem(storageKey));
  }

  // Set the info to session storage for the lifetime of the setting.
  if (["false", "no", "0", "-1"].includes(query[urlKey])) {
    sessionStorage.removeItem(storageKey);
    return false;
  } else {
    sessionStorage.setItem(storageKey, true);
    return true;
  }
};

export const useLayoutEmbed = () => {
  const urlKey = useGetConfig("one.layout.embed.param.key", "embed");
  const storageKey = useGetConfig("one.layout.embed.storage.key", "embed");

  const [queryString, setQueryString] = useQueryString(
    window.location,
    navigate
  );

  const [isEmbed, setIsEmbed] = useState(false);

  useEffect(() => {
    const value = getIsEmbed(queryString, urlKey, storageKey);
    setIsEmbed(value);
  }, [queryString]);

  return {
    isEmbed,
    setIsEmbed: (val) => setQueryString({ [urlKey]: !!val ? "yes" : "no" })
  };
};
