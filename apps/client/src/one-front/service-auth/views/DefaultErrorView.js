export const DefaultErrorView = ({ error }) => (
  <div>
    <h4>Oooops!</h4>
    <p style={{ color: "red" }}>{error.message}</p>
    <small>
      <code>one-front/service-loading/components/DefaultErrorView.js</code>
    </small>
  </div>
);
