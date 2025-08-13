import { Outlet } from "react-router-dom";
import { DateTimeProvider } from "../providers/datetime/DateTimeProvider";
import { useTimeConfigQuery } from "../queries/hooks";
import { Box, Container, CssBaseline } from "@mui/material";
import { AppBar } from "../components/AppBar";
import { LoadingOverlay } from "../components/LoadingOverlay";

export function AppLayout() {
  const { data: config, isLoading } = useTimeConfigQuery();

  return (
    <DateTimeProvider config={config ?? null} ready={!isLoading}>
      <CssBaseline />
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <Box>
          <AppBar />
          <Box sx={{ flexGrow: 1 }}>
            <Container sx={{ py: 3 }}>
              <Outlet />
            </Container>
          </Box>
        </Box>
      )}
    </DateTimeProvider>
  );
}
