import { Dashboard } from "./Dashboard";
import { Page } from "./Page";

export const dashboard = () => [
  {
    target: "$ONE_LAYOUT_ROUTE",
    handler: {
      path: "/",
      element: <Dashboard />
    }
  },
  {
    target: "$ONE_LAYOUT_ROUTE",
    handler: {
      path: "/page/:id",
      element: <Page />
    }
  }
];
