import { useAuth } from "../../one-front";

export const PublicView = () => {
  const auth = useAuth();
  return (
    <div>
      <h4>Login as</h4>
      <li onClick={() => auth.setToken("luke")}>Luke Skywalker</li>
      <li onClick={() => auth.setToken("ian")}>Ian Solo</li>
    </div>
  );
};
