import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import { ScheduledItemsPage } from "./pages/scheduled-items/ScheduledItemsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { AppLayout } from "./layout/AppLayout";
import { AtlasThemeProvider } from "@diligentcorp/atlas-theme-mui";
import { lensThemeOptions } from "@diligentcorp/atlas-theme-mui/lib/themes/lens/index.js";
import { createLensDataGridThemeOptions } from "@diligentcorp/atlas-theme-mui-data-grid/lib/index.js";
import { createLensDatePickerThemeOptions } from "@diligentcorp/atlas-theme-mui-date-pickers/lib/index.js";
import { QueryProvider } from "./queries/client";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "scheduled-items", element: <ScheduledItemsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AtlasThemeProvider
      themeOptions={lensThemeOptions}
      themeExtensions={[
        createLensDataGridThemeOptions,
        createLensDatePickerThemeOptions,
      ]}
    >
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </AtlasThemeProvider>
  </StrictMode>
);
