import { PublicView } from "./PublicView";
import { useApplicationToken } from "./use-application-token";

export const fakeLogin = () => [
  {
    target: "$ONE_AUTH_PUBLIC_VIEW",
    handler: { component: PublicView }
  },
  {
    target: "$ONE_AUTH_USE_APPLICATION_TOKEN",
    handler: { hook: useApplicationToken }
  }
];
