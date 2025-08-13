import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { DateTime } from 'luxon'
import { useDateTimeTools } from '../providers/datetime/useDateTimeTools'
import type { ItemUpdatePayload } from '../types/items'

type Props = Readonly<{
  id: string
  defaultName: string
  defaultScheduledForUtc: string
  onSubmit: (payload: ItemUpdatePayload) => void
  disabled?: boolean
}>

export function ItemEditor({ id, defaultName, defaultScheduledForUtc, onSubmit, disabled = false }: Props) {
  const { toOrgTz, orgTzToUtcIso, formatUtcInOrgTz } = useDateTimeTools()
  const [name, setName] = useState(defaultName)
  const [scheduledOrg, setScheduledOrg] = useState<DateTime>(toOrgTz(defaultScheduledForUtc))

  const formattedPreview = useMemo(
    () => formatUtcInOrgTz(orgTzToUtcIso(scheduledOrg)),
    [scheduledOrg, formatUtcInOrgTz, orgTzToUtcIso]
  )
  const helperText = useMemo(
    () => (formattedPreview ? `Preview: ${formattedPreview}` : undefined),
    [formattedPreview]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const utcIso = orgTzToUtcIso(scheduledOrg)
      if (!id) return
      onSubmit({ id, name, scheduledForUtc: utcIso })
    },
    [id, name, scheduledOrg, onSubmit, orgTzToUtcIso]
  )

  return (
    <Box
      component="form"
      id="item-editor-form"
      onSubmit={handleSubmit}
      sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}
    >
      <Stack spacing={2}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
        />
        <DateTimePicker
          label="Scheduled"
          value={scheduledOrg}
          onChange={(v) => {
            if (v?.isValid) setScheduledOrg(v)
          }}
          disabled={disabled}
          slotProps={{ textField: { helperText } }}
        />
        <Typography variant="caption">Submit serializes to UTC ISO for persistence.</Typography>
      </Stack>
    </Box>
  );
}
