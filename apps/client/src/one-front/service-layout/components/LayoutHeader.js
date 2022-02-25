import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const LayoutHeader = ({ title }) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);
