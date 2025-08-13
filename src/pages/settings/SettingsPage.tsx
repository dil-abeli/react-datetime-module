import { Box, Paper, Stack, TextField, Typography, MenuItem } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTimeConfigQuery, useUpdateTimeConfigMutation } from '../../queries/hooks'
import { SubmitButton } from '../../components/ui/SubmitButton'
import { formatUtcForTimezone } from '../../providers/datetime/utils'
import { USER_DATE_FORMATS, USER_TIME_FORMATS, TIME_FORMAT_PATTERN, isUserDateFormat, isUserTimeFormat } from '../../providers/datetime/constants'
import { DateDisplay } from '../../components/DateDisplay'

export function SettingsPage() {
  const { data: config } = useTimeConfigQuery()
  const { mutateAsync, isPending } = useUpdateTimeConfigMutation()

  const [orgTz, setOrgTz] = useState(config?.orgTimezone ?? 'UTC')
  const [userTz, setUserTz] = useState(config?.userTimezone ?? 'UTC')
  const [dateFormat, setDateFormat] = useState(config?.userDateFormat ?? 'yyyy/MM/dd')
  const [timeFormat, setTimeFormat] = useState(config?.userTimeFormat ?? '24h')

  const tzOptions = useMemo(
    () => ['UTC', 'Europe/Budapest', 'America/New_York', 'Europe/London', 'Asia/Tokyo'],
    [],
  )

  const handleSave = async () => {
    await mutateAsync({
      orgTimezone: orgTz,
      userTimezone: userTz,
      userDateFormat: dateFormat,
      userTimeFormat: timeFormat,
    })
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2} maxWidth={480}>
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
            label="User Date Format"
            value={dateFormat}
            onChange={(e) => {
              const value = e.target.value
              if (isUserDateFormat(value)) setDateFormat(value)
            }}
            helperText={formatUtcForTimezone(new Date().toISOString(), orgTz, `${dateFormat} ${TIME_FORMAT_PATTERN[timeFormat]}`)}
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
              const value = e.target.value
              if (isUserTimeFormat(value)) setTimeFormat(value)
            }}
          >
            {USER_TIME_FORMATS.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={1}>
          <Typography variant="labelSm" fontWeight={800} alignSelf="center">
            Preview
          </Typography>
          <DateDisplay
            utcIso={new Date().toISOString()}
            format={`${dateFormat} ${TIME_FORMAT_PATTERN[timeFormat]}`}
          />
          </Stack>
          <Stack direction="row" spacing={1}>
            <SubmitButton variant="contained" onClick={handleSave} loading={isPending}>
              Save
            </SubmitButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  )
}

export default SettingsPage


