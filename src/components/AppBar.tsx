import { Box, AppBar as MuiAppBar, Toolbar, Typography, Button as MuiButton, IconButton } from '@mui/material';
import SettingsIcon from "@diligentcorp/atlas-react-icons/dist/esm/lens/Settings.js";
import { Link as RouterLink } from 'react-router-dom';

type Props = Readonly<{ onOpenSettings?: () => void }>;

export function AppBar({ onOpenSettings }: Props) {
  return (
    <MuiAppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h4"
          color="inherit"
          sx={{ textDecoration: "none" }}
        >
          Date/Time Demo
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <MuiButton component={RouterLink} to="/" color="inherit" disableTouchRipple size='small'>
          Home
        </MuiButton>
        <MuiButton
          component={RouterLink}
          to="/scheduled-items"
          color="inherit"
          size='small'
          disableTouchRipple
        >
          Scheduled Items
        </MuiButton>
        <IconButton color="inherit" size="small" onClick={onOpenSettings}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </MuiAppBar>
  );
}