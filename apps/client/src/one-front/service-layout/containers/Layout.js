import { useGetContext } from "@forrestjs/react-root";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { useAuth } from "../../service-auth";
import { LayoutRoutes } from "./LayoutRoutes";

export const Layout = () => {
  const auth = useAuth();
  const routes = useGetContext("one.layout.route.items");

  return (
    <Box>
      <CssBaseline />
      <h4>Layout</h4>
      <LayoutRoutes items={routes} />
    </Box>
  );
};
