import { useAuth } from "../service-auth";

export const Layout = () => {
  const auth = useAuth();
  return (
    <div>
      <h4>Layout</h4>
      {auth.token}
      <button onClick={() => auth.setToken(null)}>logout</button>
    </div>
  );
};
