import { useAuth } from "../../one-front";

export const PublicView = () => {
  const auth = useAuth();
  return (
    <div>
      <h4>Login Required!</h4>
      <a href="http://localhost:4040">Please login here</a>
    </div>
  );
};
