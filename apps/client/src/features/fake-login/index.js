import { PublicView } from "./PublicView";
import { ErrorView } from "./ErrorView";
import { useApplicationToken } from "./use-application-token";

export const fakeLogin = () => [
  {
    target: "$ONE_AUTH_PUBLIC_VIEW",
    handler: { component: PublicView }
  },
  {
    target: "$ONE_AUTH_ERROR_VIEW",
    handler: { component: ErrorView }
  },
  {
    target: "$ONE_AUTH_USE_APPLICATION_TOKEN",
    handler: { hook: useApplicationToken }
  }
];
