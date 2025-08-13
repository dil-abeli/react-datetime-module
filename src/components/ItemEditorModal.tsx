import { lazy, Suspense, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogActions, CircularProgress, Box } from '@mui/material'
import type { Item } from '../store/itemsStore'
import type { ItemUpdatePayload } from '../types/items'
import { SubmitButton } from './ui/SubmitButton'
import { Button } from './ui/Button'

const ItemEditor = lazy(() => import('./ItemEditor').then(module => ({ default: module.ItemEditor })))

type Props = Readonly<{
  open: boolean
  item: Item | null
  onClose: () => void
  onSubmit: (payload: ItemUpdatePayload) => Promise<unknown> | void
}>

export function ItemEditorModal({ open, item, onClose, onSubmit }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (payload: { name: string; scheduledForUtc: string }) => {
    if (!item) return
    setIsSubmitting(true)
    try {
      await onSubmit({ id: item.id, ...payload })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            minHeight: 400,
            width: '100%',
            maxWidth: 600
          }
        }
      }}
    >
      <DialogTitle>
        {item ? `Edit ${item.name}` : 'Edit Item'}
      </DialogTitle>
      <DialogContent sx={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
        <Suspense fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              flex: 1,
              minHeight: 250
            }}
          >
            <CircularProgress />
          </Box>
        }>
          {item && (
            <ItemEditor
              id={item.id}
              defaultName={item.name}
              defaultScheduledForUtc={item.scheduledForUtc}
              onSubmit={handleSubmit}
              disabled={isSubmitting}
            />
          )}
        </Suspense>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <SubmitButton
          type="submit"
          form="item-editor-form"
          variant="contained"
          loading={isSubmitting}
          loadingPosition="start"
        >
          Save
        </SubmitButton>
      </DialogActions>
    </Dialog>
  )
}
