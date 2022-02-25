import { createContext } from "react";

import { useLayoutEmbed } from "./use-layout-embed";
import { useLayoutTitle } from "./use-layout-title";
import { useLayoutRoutes } from "./use-layout-routes";

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  return (
    <LayoutContext.Provider
      value={{
        ...useLayoutEmbed(),
        ...useLayoutTitle(),
        ...useLayoutRoutes()
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
