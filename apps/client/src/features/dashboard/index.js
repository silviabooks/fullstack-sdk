import { Dashboard } from "./Dashboard";

export const dashboard = () => [
  {
    target: "$ONE_LAYOUT_ROUTE",
    handler: {
      path: "/",
      element: <Dashboard />
    }
  }
];
