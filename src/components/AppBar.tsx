import { Box, AppBar as MuiAppBar, Toolbar, Typography, Button as MuiButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function AppBar() {
  return (
    <MuiAppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Date/Time Demo
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <MuiButton
          component={RouterLink}
          to="/"
          color="inherit"
          disableTouchRipple
        >
          Home
        </MuiButton>
        <MuiButton
          component={RouterLink}
          to="/scheduled-items"
          color="inherit"
          disableTouchRipple
        >
          Scheduled Items
        </MuiButton>
        <MuiButton
          component={RouterLink}
          to="/settings"
          color="inherit"
          disableTouchRipple
        >
          Settings
        </MuiButton>
      </Toolbar>
    </MuiAppBar>
  );
}