import { useCallback } from 'react';
import { useDateTimeConfig, useDateTimeService } from './hooks';
import type { DateTime } from 'luxon';

export function useDateTimeTools() {
  const { ready } = useDateTimeConfig();
  const service = useDateTimeService();

  const formatUtcInOrgTz = useCallback(
    (utcIso: string) => (ready ? service.formatUtc(utcIso) : ""),
    [service, ready]
  );
  const toOrgTz = useCallback(
    (utcIso: string) => service.toOrg(utcIso),
    [service]
  );
  const orgTzToUtcIso = useCallback((dt: DateTime) => service.toUtcIso(dt), [service]);

  return { formatUtcInOrgTz, toOrgTz, orgTzToUtcIso };
}
