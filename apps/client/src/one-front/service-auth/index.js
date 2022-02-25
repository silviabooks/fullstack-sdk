import { onInitService } from "./init-service";
import { AuthProvider } from "./state/AuthProvider";
import { AuthRoot } from "./containers/AuthRoot";

export { useAuth } from "./state/use-auth";

export const serviceAuth = ({ registerTargets }) => {
  registerTargets({
    ONE_FRONT_AUTH_USE_APPLICATION_TOKEN:
      "one-front/auth/strategy/use-application-token",
    ONE_FRONT_AUTH_LOADING_VIEW: "one-front/auth/view/loading",
    ONE_FRONT_AUTH_ERROR_VIEW: "one-front/auth/view/error",
    ONE_FRONT_AUTH_PUBLIC_VIEW: "one-front/auth/view/public"
  });

  return [
    {
      target: "$INIT_SERVICE",
      handler: onInitService
    },
    {
      target: "$REACT_ROOT_WRAPPER",
      handler: { component: AuthProvider }
    },
    {
      priority: -1,
      target: "$REACT_ROOT_COMPONENT",
      handler: (props) => ({
        component: AuthRoot,
        props
      })
    }
  ];
};
