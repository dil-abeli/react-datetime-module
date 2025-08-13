import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import { ScheduledItemsPage } from './pages/scheduled-items/ScheduledItemsPage'
import { AppLayout } from './layout/AppLayout'
import { AtlasThemeProvider } from '@diligentcorp/atlas-theme-mui'
import { lensThemeOptions } from '@diligentcorp/atlas-theme-mui/lib/themes/lens/index.js'
import { QueryProvider } from './queries/client'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <App /> },
      { path: 'scheduled-items', element: <ScheduledItemsPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AtlasThemeProvider themeOptions={lensThemeOptions}>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </AtlasThemeProvider>
  </StrictMode>
);
