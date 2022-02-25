import { createElement } from "react";
import { useGetContext } from "@forrestjs/react-root";

import { useAuth } from "../state/use-auth";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export const AuthRoot = ({ component, props = {} }) => {
  const LoadingView = useGetContext("oneFront.auth.view.loading");
  const ErrorView = useGetContext("oneFront.auth.view.error");
  const PublicView = useGetContext("oneFront.auth.view.public");
  const { loading, error, isPublic } = useAuth();

  if (loading) {
    return (
      <ErrorBoundary>
        {createElement(LoadingView.component, LoadingView.props)}
      </ErrorBoundary>
    );
  }

  if (error) {
    return (
      <ErrorBoundary>
        {createElement(ErrorView.component, {
          ...ErrorView.props,
          error
        })}
      </ErrorBoundary>
    );
  }

  if (isPublic) {
    return (
      <ErrorBoundary>
        {createElement(PublicView.component, PublicView.props)}
      </ErrorBoundary>
    );
  }

  // Create the main App with additional APIs?
  // Or any login API should be accessed by hooks?
  return (
    <ErrorBoundary>{createElement(component, { ...props })}</ErrorBoundary>
  );
};
