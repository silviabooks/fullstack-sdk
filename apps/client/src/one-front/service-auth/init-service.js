import { DefaultLoadingView } from "./views/DefaultLoadingView";
import { DefaultErrorView } from "./views/DefaultErrorView";
import { DefaultPublicView } from "./views/DefaultPublicView";
import { useDelegatedApplicationToken } from "./state/use-delegated-application-token";

export const onInitService = ({ createExtension, getConfig, setContext }) => {
  const { value: LoadingView } = createExtension.waterfall(
    "$ONE_AUTH_LOADING_VIEW",
    getConfig("one.auth.view.loading", { component: DefaultLoadingView })
  );

  const { value: ErrorView } = createExtension.waterfall(
    "$ONE_AUTH_ERROR_VIEW",
    getConfig("one.auth.view.error", { component: DefaultErrorView })
  );

  const { value: PublicView } = createExtension.waterfall(
    "$ONE_AUTH_PUBLIC_VIEW",
    getConfig("one.auth.view.public", { component: DefaultPublicView })
  );

  const { value: useApplicationToken } = createExtension.waterfall(
    "$ONE_AUTH_USE_APPLICATION_TOKEN",
    getConfig("one.auth.useApplicationToken", {
      hook: useDelegatedApplicationToken
    })
  );

  setContext("one.auth", {
    view: {
      loading: LoadingView,
      error: ErrorView,
      public: PublicView
    },
    strategy: {
      useApplicationToken
    }
  });
};
