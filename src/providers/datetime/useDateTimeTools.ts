import { useCallback } from 'react';
import { useDateTimeConfig } from './hooks';
import { formatUtcForDisplay, utcIsoToOrgDateTime, orgDateTimeToUtcIso } from './utils';
import type { DateTime } from 'luxon';

export function useDateTimeTools() {
  const { orgTimezone, userDateFormat, ready } = useDateTimeConfig();

  const formatUtcInOrgTz = useCallback(
    (utcIso: string) => (ready ? formatUtcForDisplay(utcIso, orgTimezone, userDateFormat) : ""),
    [orgTimezone, userDateFormat, ready]
  );
  const toOrgTz = useCallback(
    (utcIso: string) => utcIsoToOrgDateTime(utcIso, orgTimezone),
    [orgTimezone]
  );
  const orgTzToUtcIso = useCallback((dt: DateTime) => orgDateTimeToUtcIso(dt), []);

  return { formatUtcInOrgTz, toOrgTz, orgTzToUtcIso };
}
