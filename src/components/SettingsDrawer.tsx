import {
  Box,
  Drawer,
  Typography,
  TextField,
  MenuItem,
  Stack,
  Paper,
} from "@mui/material";
import { useMemo, useState } from "react";
import {
  useTimeConfigQuery,
  useUpdateTimeConfigMutation,
} from "../queries/hooks";
import { SubmitButton } from "./ui/SubmitButton";
import { formatUtcForTimezone } from "../providers/datetime/utils";
import {
  USER_DATE_FORMATS,
  USER_TIME_FORMATS,
  TIME_FORMAT_PATTERN,
  isUserDateFormat,
  isUserTimeFormat,
} from "../providers/datetime/constants";
import { DateDisplay } from "./DateDisplay";

type SettingsDrawerProps = Readonly<{
  open: boolean;
  onClose: () => void;
}>;

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
  const { data: config } = useTimeConfigQuery();
  const { mutateAsync, isPending } = useUpdateTimeConfigMutation();

  const [orgTz, setOrgTz] = useState(config?.orgTimezone ?? "UTC");
  const [userTz, setUserTz] = useState(config?.userTimezone ?? "UTC");
  const [dateFormat, setDateFormat] = useState(
    config?.userDateFormat ?? "yyyy/MM/dd"
  );
  const [timeFormat, setTimeFormat] = useState(config?.userTimeFormat ?? "24h");
  const [defaultDisplayTz, setDefaultDisplayTz] = useState<"org" | "user">(
    config?.defaultDisplayTz ?? "org"
  );

  const tzOptions = useMemo(
    () => [
      "UTC",
      "Europe/Budapest",
      "America/New_York",
      "Europe/London",
      "Asia/Tokyo",
    ],
    []
  );

  const handleSave = async () => {
    await mutateAsync({
      orgTimezone: orgTz,
      userTimezone: userTz,
      userDateFormat: dateFormat,
      userTimeFormat: timeFormat,
      defaultDisplayTz,
    });
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: 480, p: 2 } } }}
    >
      <Box>
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>
        <Stack spacing={2} py={2}>
          <Stack spacing={2} pb={2}>
            <TextField
              select
              label="Organization Timezone"
              value={orgTz}
              onChange={(e) => setOrgTz(e.target.value)}
            >
              {tzOptions.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="User Timezone"
              value={userTz}
              onChange={(e) => setUserTz(e.target.value)}
            >
              {tzOptions.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Default Display Timezone"
              value={defaultDisplayTz}
              onChange={(e) =>
                setDefaultDisplayTz(e.target.value as "org" | "user")
              }
            >
              <MenuItem value="org">Organization</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </TextField>
            <TextField
              select
              label="User Date Format"
              value={dateFormat}
              onChange={(e) => {
                const value = e.target.value;
                if (isUserDateFormat(value)) setDateFormat(value);
              }}
              helperText={formatUtcForTimezone(
                new Date().toISOString(),
                orgTz,
                `${dateFormat} ${TIME_FORMAT_PATTERN[timeFormat]}`
              )}
            >
              {USER_DATE_FORMATS.map((fmt) => (
                <MenuItem key={fmt} value={fmt}>
                  {fmt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="User Time Format"
              value={timeFormat}
              onChange={(e) => {
                const value = e.target.value;
                if (isUserTimeFormat(value)) setTimeFormat(value);
              }}
            >
              {USER_TIME_FORMATS.map((fmt) => (
                <MenuItem key={fmt} value={fmt}>
                  {fmt}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <Stack spacing={2} pb={3}>
          <Typography variant="labelSm" fontWeight={600}>
            PREVIEW
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: "8px !important",
            }}
          >
            <DateDisplay
              utcIso={new Date().toISOString()}
              format={`${dateFormat} ${TIME_FORMAT_PATTERN[timeFormat]}`}
            />
          </Paper>
          </Stack>
          <Stack direction="row" spacing={1} justifyContent="center">
            <SubmitButton
              variant="contained"
              onClick={handleSave}
              loading={isPending}
              sx={{ minWidth: 200 }}
            >
              Save
            </SubmitButton>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
