import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "../../components/ErrorBoundary";

export const LayoutRoutes = ({ items = [] }) => {
  if (!items.length) {
    return (
      <div
        style={{
          margin: "10px 23px"
        }}
      >
        No routes configured.
        <br />
        Please hook into{" "}
        <em>
          <code>LAYOUT_ROUTE</code>
        </em>
        .
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Routes>
        {items.map((routeConfig, idx) => (
          <Route key={idx} {...routeConfig} />
        ))}
      </Routes>
    </ErrorBoundary>
  );
};
