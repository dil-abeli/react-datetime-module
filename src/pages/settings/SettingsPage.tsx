import { Box, Paper, Stack, TextField, Typography, MenuItem } from '@mui/material'
import { useMemo, useState } from 'react'
import { useTimeConfigQuery, useUpdateTimeConfigMutation } from '../../queries/hooks'
import { useDateTimeConfig } from '../../providers/datetime/hooks'
import { SubmitButton } from '../../components/ui/SubmitButton'
import { formatUtcForTimezone } from '../../providers/datetime/utils'

export function SettingsPage() {
  const { data: config } = useTimeConfigQuery()
  const { userDateFormat } = useDateTimeConfig()
  const { mutateAsync, isPending } = useUpdateTimeConfigMutation()

  const [orgTz, setOrgTz] = useState(config?.orgTimezone ?? 'UTC')
  const [userTz, setUserTz] = useState(config?.userTimezone ?? 'UTC')
  const [dateFormat, setDateFormat] = useState(config?.userDateFormat ?? userDateFormat)

  const tzOptions = useMemo(
    () => ['UTC', 'Europe/Budapest', 'America/New_York', 'Europe/London', 'Asia/Tokyo'],
    [],
  )

  const handleSave = async () => {
    await mutateAsync({ orgTimezone: orgTz, userTimezone: userTz, userDateFormat: dateFormat })
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
            label="User Date Format"
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            helperText={formatUtcForTimezone(new Date().toISOString(), orgTz, dateFormat)}
          />
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


