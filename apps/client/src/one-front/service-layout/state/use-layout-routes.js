import { useGetContext } from "@forrestjs/react-root";

export const useLayoutRoutes = () => ({
  routes: useGetContext("one.layout.routes")
});
