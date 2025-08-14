import { Outlet } from "react-router-dom";
import { DateTimeProvider } from "../providers/datetime/DateTimeProvider";
import { useTimeConfigQuery } from "../queries/hooks";
import { Box, Container, CssBaseline } from "@mui/material";
import { AppBar } from "../components/AppBar";
import { SettingsDrawer } from "../components/SettingsDrawer";
import { useState } from "react";
import { LoadingOverlay } from "../components/LoadingOverlay";

export function AppLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: config, isLoading } = useTimeConfigQuery();

  return (
    <DateTimeProvider config={config ?? null} ready={!isLoading}>
      <CssBaseline />
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <Box>
          <AppBar onOpenSettings={() => setSettingsOpen(true)} />
          <Box sx={{ flexGrow: 1 }}>
            <Container sx={{ py: 3 }}>
              <Outlet />
            </Container>
          </Box>
          <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        </Box>
      )}
    </DateTimeProvider>
  );
}
