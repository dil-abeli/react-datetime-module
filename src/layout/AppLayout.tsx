import { Outlet, Link as RouterLink } from 'react-router-dom'
import { DateTimeProvider } from '../providers/datetime/DateTimeProvider'
import { useTimeConfigQuery } from '../queries/hooks'
import { QueryProvider } from '../queries/client'
import { AppBar, Toolbar, Typography, Box, Container, Backdrop, CircularProgress, Button as MuiButton } from '@mui/material'

export function AppLayout() {
  const { data: config, isLoading } = useTimeConfigQuery()

  return (
    <QueryProvider>
      <DateTimeProvider config={config ?? null} ready={!isLoading}>
        <AppBar position="static" color="default" elevation={0}>
          <Toolbar>
            <Typography component={RouterLink} to="/" variant="h6" color="inherit" sx={{ textDecoration: 'none' }}>
              App
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <MuiButton component={RouterLink} to="/" color="inherit" disableTouchRipple>Home</MuiButton>
            <MuiButton component={RouterLink} to="/scheduled-items" color="inherit" disableTouchRipple>Scheduled Items</MuiButton>
          </Toolbar>
        </AppBar>
        <Container sx={{ py: 3 }}>
          <Outlet />
        </Container>
        <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </DateTimeProvider>
    </QueryProvider>
  )
}
