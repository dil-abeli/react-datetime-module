import { Container, Snackbar, Typography } from '@mui/material';

import { useState } from 'react';

export function HomePage() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Centralized Date/Time Demo
      </Typography>
      <Typography variant="h6" gutterBottom>
        Welcome fellow developer! 😊
      </Typography>
      <Typography variant="body2">
        This app demonstrates a centralized date/time provider that can be used to display and edit dates and times in a consistent way across the application.
      </Typography>
      <Snackbar
        open={Boolean(toast)}
        onClose={() => setToast(null)}
        message={toast ?? ""}
        autoHideDuration={4000}
      />
    </Container>
  );
}