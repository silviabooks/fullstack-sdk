import { useParams, Link } from "react-router-dom";

export const Page = () => {
  const { id } = useParams();
  return (
    <div>
      <p>
        Page: <b>{id}</b>
      </p>
      <Link to="/">Go to dashboard</Link>
    </div>
  );
};
