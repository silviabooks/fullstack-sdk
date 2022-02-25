import { createElement } from "react";
import { useGetContext } from "@forrestjs/react-root";

import { useAuth } from "../state/use-auth";

export const AuthRoot = ({ component, props = {} }) => {
  const LoadingView = useGetContext("oneFront.auth.view.loading");
  const ErrorView = useGetContext("oneFront.auth.view.error");
  const PublicView = useGetContext("oneFront.auth.view.public");
  const { loading, error, isPublic } = useAuth();

  if (loading) {
    return createElement(LoadingView.component, LoadingView.props);
  }

  if (error) {
    return createElement(ErrorView.component, {
      ...ErrorView.props,
      error
    });
  }

  if (isPublic) {
    return createElement(PublicView.component, PublicView.props);
  }

  // Create the main App with additional APIs?
  // Or any login API should be accessed by hooks?
  return createElement(component, { ...props });
};
