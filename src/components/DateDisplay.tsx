import { Tooltip, Typography, Stack, useTheme } from "@mui/material";
import { DateTime } from "luxon";
import { useDateTimeConfig } from "../providers/datetime/hooks";

type DateDisplayProps = Readonly<{
  utcIso?: string | null;
  format?: string;
  timezones?: readonly string[];
  labelMap?: Readonly<Record<string, string>>;
  placement?: "bottom-end" | "bottom-start" | "bottom" | "left-end" | "left-start" | "left" | "right-end" | "right-start" | "right" | "top-end" | "top-start" | "top";
  emptyText?: string;
}>;

function formatForTimezone(utcIso: string, tz: string, format: string): string {
  return DateTime.fromISO(utcIso, { zone: "utc" }).setZone(tz).toFormat(format);
}

export function DateDisplay({
  utcIso,
  format,
  timezones,
  labelMap,
  placement = "top",
  emptyText = "-",
}: DateDisplayProps) {
  const theme = useTheme();
  const { orgTimezone, userTimezone, userDateFormat, ready } = useDateTimeConfig();

  if (!utcIso || !ready) return <span>{emptyText}</span>;

  const displayFormat = format ?? userDateFormat;

  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzCandidates: string[] = [
    userTimezone,
    orgTimezone,
    "UTC",
    browserTimezone,
    ...(timezones ?? []),
  ];
  const tzs: string[] = Array.from(new Set(tzCandidates.filter((v) => v)));

  const tooltipContent = (
    <Stack spacing={0.5} sx={{ minWidth: 220 }}>
      {tzs.map((tz) => {
        const label = labelMap?.[tz] ?? tz;
        const value = formatForTimezone(utcIso, tz, displayFormat);
        return (
          <Stack key={tz} direction="row" justifyContent="space-between" gap={1}>
            <Typography variant="caption" color="text.light">{label}</Typography>
            <Typography variant="caption">{value}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );

  const atlasTooltipPreset: Record<string, unknown> = (theme as any)?.presets?.TooltipPresets?.type?.dark ?? {};

  const displayText = formatForTimezone(utcIso, orgTimezone, displayFormat);

  return (
    <Tooltip placement={placement} title={tooltipContent} {...atlasTooltipPreset}>
      <span>{displayText}</span>
    </Tooltip>
  );
}

export default DateDisplay;


