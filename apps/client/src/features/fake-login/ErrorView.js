export const ErrorView = ({ error }) => (
  <div>
    <h4>{error.response ? error.response.data : error.message}</h4>
    <a href="http://localhost:4040">Please login here</a>
  </div>
);
