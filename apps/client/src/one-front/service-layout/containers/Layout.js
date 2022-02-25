import { useGetContext } from "@forrestjs/react-root";

import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

import { useLayout } from "../state/use-layout";
import { LayoutRoutes } from "../components/LayoutRoutes";
import { LayoutHeader } from "../components/LayoutHeader";

export const Layout = () => {
  const { isEmbed, title, routes } = useLayout();

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
    </Box>
  );
};
