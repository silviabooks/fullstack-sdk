import { useGetContext } from "@forrestjs/react-root";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { useAuth } from "../../service-auth";
import { useEmbed } from "../state/use-embed";
import { LayoutRoutes } from "./LayoutRoutes";

export const Layout = () => {
  const auth = useAuth();
  const { isEmbed } = useEmbed();
  const routes = useGetContext("one.layout.route.items");

  // Embed mode - Pure routing
  if (isEmbed) {
    return (
      <Box>
        <CssBaseline />
        <LayoutRoutes items={routes} />
      </Box>
    );
  }

  // Layout Mode - full UI
  return (
    <Box>
      <CssBaseline />
      <h4>Layout</h4>
      <LayoutRoutes items={routes} />
      <hr />
      {auth.token}
    </Box>
  );
};
