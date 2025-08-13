## DateTime Service – Integration Guide

The DateTime service is framework‑agnostic and centralizes time zone conversion and formatting.

### API

```ts
import { createDateTimeService } from "../src/services/datetime/DateTimeService";

const svc = createDateTimeService({
  orgTimezone: "UTC",
  userTimezone: "UTC",
  userDateFormat: "yyyy/MM/dd",
  userTimeFormat: "24h",
  // now?: () => Date // optional for tests
});

svc.formatUtc("2024-01-01T12:34:00Z");
svc.toOrg("2024-01-01T12:34:00Z");
svc.toUtcIso(svc.nowInOrg());
```

Note: In this repo the React provider already wires the service for you. See React section.

---

### React (web and native)

Use the existing `DateTimeProvider` and hooks:

```tsx
import { DateTimeProvider } from "../src/providers/datetime/DateTimeProvider";
import { useDateTimeService } from "../src/providers/datetime/hooks";

function AppRoot({ config }: { config: any }) {
  return (
    <DateTimeProvider config={config} ready={true}>
      <App />
    </DateTimeProvider>
  );
}

function Component() {
  const dt = useDateTimeService();
  return <span>{dt.formatUtc("2024-01-01T12:34:00Z")}</span>;
}
```

If you prefer, `useDateTimeTools()` wraps common tasks and now delegates to the service.

---

### Next.js (App Router)

- Client components: wrap your tree with `DateTimeProvider` in a `Providers` client module.
- Server code: create the service on demand with tenant/user config.

```tsx
// app/providers.tsx ("use client")
import { DateTimeProvider } from "../src/providers/datetime/DateTimeProvider";

export function Providers({ children, config }: any) {
  return (
    <DateTimeProvider config={config} ready={true}>{children}</DateTimeProvider>
  );
}

// app/page.tsx
import { Providers } from "./providers";

export default async function Page() {
  const config = await fetchConfig();
  return <Providers config={config}>{/* ... */}</Providers>;
}
```

---

### Vue 3

Provide/inject the service or wrap in a tiny plugin.

```ts
// services/datetime.ts
import { createDateTimeService } from "../src/services/datetime/DateTimeService";
export const dateTimeService = createDateTimeService({
  orgTimezone: "UTC",
  userTimezone: "UTC",
  userDateFormat: "yyyy/MM/dd",
  userTimeFormat: "24h",
});

// main.ts
const app = createApp(App);
app.provide("dateTimeService", dateTimeService);
app.mount("#app");

// composable
import { inject } from "vue";
import type { DateTimeService } from "../src/services/datetime/DateTimeService";
export function useDateTimeService() {
  return inject("dateTimeService") as DateTimeService;
}
```

---

### Angular

Provide the service via an injection token and a factory.

```ts
// datetime.token.ts
import { InjectionToken } from "@angular/core";
import { createDateTimeService } from "../src/services/datetime/DateTimeService";
import type { DateTimeService } from "../src/services/datetime/DateTimeService";

export const DATE_TIME_SERVICE = new InjectionToken<DateTimeService>("DateTimeService");

export function dateTimeFactory(): DateTimeService {
  return createDateTimeService({
    orgTimezone: "UTC",
    userTimezone: "UTC",
    userDateFormat: "yyyy/MM/dd",
    userTimeFormat: "24h",
  });
}

// app.config.ts or app.module.ts
providers: [{ provide: DATE_TIME_SERVICE, useFactory: dateTimeFactory }]

// usage in a component
constructor(@Inject(DATE_TIME_SERVICE) private dt: DateTimeService) {}
```

---

### Svelte / SvelteKit

Use `setContext/getContext` or a writable store.

```ts
// src/lib/datetime.ts
import { setContext, getContext } from "svelte";
import { createDateTimeService } from "../src/services/datetime/DateTimeService";
import type { DateTimeService } from "../src/services/datetime/DateTimeService";

const KEY = Symbol("DateTimeService");

export function initDateTime(config): DateTimeService {
  const svc = createDateTimeService(config);
  setContext(KEY, svc);
  return svc;
}
export function useDateTimeService(): DateTimeService {
  return getContext<DateTimeService>(KEY);
}
```

---

### Node/Express (server)

Create per-request instances using tenant/user config; avoid a mutable singleton.

```ts
app.use((req, _res, next) => {
  req.dateTime = createDateTimeService({
    orgTimezone: req.tenant.tz,
    userTimezone: req.user.tz,
    userDateFormat: "yyyy/MM/dd",
    userTimeFormat: "24h",
  });
  next();
});

app.get("/reports", (req, res) => {
  const formatted = req.dateTime.formatUtc("2024-01-01T12:34:00Z");
  res.send({ formatted });
});
```

---

### Testing (Vitest/Jest)

Inject a deterministic clock via `now`.

```ts
import { createDateTimeService } from "../src/services/datetime/DateTimeService";

const fixedNow = () => new Date("2024-04-10T00:00:00Z");
const svc = createDateTimeService({
  orgTimezone: "America/New_York",
  userTimezone: "UTC",
  userDateFormat: "MM/dd/yyyy",
  userTimeFormat: "12h",
  now: fixedNow,
});

expect(svc.nowInOrg().toISO()).toContain("2024-04-09"); // EDT offset
```

---

### Patterns and tips

- Prefer per-user or per-request service instances. Avoid global mutable singletons.
- Keep config updates explicit via `updateConfig(next)`.
- For SSR, pass config from the server to the client and initialize the service on both sides.
- Use the React `DateTimeProvider` where available; otherwise create and inject the service into your DI/container of choice.


