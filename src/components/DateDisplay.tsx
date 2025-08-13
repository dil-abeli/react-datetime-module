import { Tooltip, Typography, Stack } from "@mui/material";
import { useMemo } from "react";
import { DateTime } from "luxon";
import { useDateTimeConfig, useDateTimeService } from "../providers/datetime/hooks";

type DateDisplayProps = Readonly<{
  utcIso?: string | null;
  format?: string;
  emptyText?: string;
}>;


export function DateDisplay({
  utcIso,
  format,
  emptyText = "—",
}: DateDisplayProps) {
  const { orgTimezone, userTimezone, userDateFormat, userTimeFormat, defaultDisplayTz, ready } = useDateTimeConfig();
  const dtService = useDateTimeService();

  const displayFormat = format ?? `${userDateFormat} ${userTimeFormat === '24h' ? 'HH:mm' : 'hh:mm a'}`;

  const tzRows = useMemo(
    () => [
      { tz: orgTimezone, label: `Org (${orgTimezone})` },
      { tz: userTimezone, label: `User (${userTimezone})` },
      { tz: "UTC", label: "UTC" },
    ],
    [orgTimezone, userTimezone],
  );

  const baseUtc = useMemo(() => (utcIso ? DateTime.fromISO(utcIso, { zone: "utc" }) : null), [utcIso]);

  if (!utcIso || !ready) return <span>{emptyText}</span>;

  const tooltipContent = (
    <Stack spacing={0.5}>
      {tzRows.map(({ tz, label }) => {
        const activeTz = defaultDisplayTz === 'user' ? userTimezone : orgTimezone;
        const isActive = tz === activeTz;
        const value = baseUtc!.setZone(tz).toFormat(displayFormat);
        return (
          <Stack key={`${label}|${tz}`} direction="row" justifyContent="space-between" gap={2}>
            <Stack sx={{ minWidth: 150 }}>
              <Typography variant="labelSm" fontWeight={isActive ? 800 : 400}>
                {label}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end">
              <Typography variant="labelSm" fontWeight={isActive ? 800 : 400}>
                {value}
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );

  const displayText = dtService.formatUtc(utcIso, displayFormat);

  return (
    <Tooltip
      placement="top"
      title={tooltipContent}
      enterDelay={1000}
      enterNextDelay={1000}
      slotProps={{ tooltip: { sx: { maxWidth: 'none' } } }}
    >
      <span>{displayText}</span>
    </Tooltip>
  );
}

export default DateDisplay;


