export const ErrorView = ({ error }) => (
  <div>
    <h4>{error.response.data}</h4>
    <a href="http://localhost:4040">Please login here</a>
  </div>
);
