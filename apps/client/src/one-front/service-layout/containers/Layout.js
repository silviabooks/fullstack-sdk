import { useGetContext } from "@forrestjs/react-root";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { useAuth } from "../../service-auth";
import { useEmbed } from "../state/use-embed";
import { LayoutRoutes } from "./LayoutRoutes";
import { LayoutHeader } from "./LayoutHeader";

export const Layout = () => {
  const auth = useAuth();
  const { isEmbed } = useEmbed();

  const title = useGetContext("one.layout.title");
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
      <LayoutHeader title={title} />
      <LayoutRoutes items={routes} />
      <hr />
      {auth.token}
    </Box>
  );
};
