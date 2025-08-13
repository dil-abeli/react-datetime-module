import { useMemo, useState } from "react";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Item } from "../../store/itemsStore";
import { useDateTimeTools } from "../../providers/datetime/useDateTimeTools";
import { ItemsGrid } from "../ItemsGrid";
import { ItemEditorModal } from "../ItemEditorModal";
import { Box } from '@mui/material';
import type { ItemUpdatePayload } from "../../types/items";

type Props = Readonly<{
  rows: Item[]
  onSubmit: (payload: ItemUpdatePayload) => Promise<unknown> | void
}>

export function ScheduledItemsGrid({ rows, onSubmit }: Props) {
  const { formatUtcInOrgTz } = useDateTimeTools();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const valueFormatter = useMemo(
    () => (value: string) => (value ? formatUtcInOrgTz(value) : ""),
    [formatUtcInOrgTz]
  );

  const columns: GridColDef<Item>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 1 },
      { field: "name", headerName: "Name", flex: 2 },
      { field: "createdAtUtc", headerName: "Created", flex: 2, valueFormatter },
      { field: "scheduledForUtc", headerName: "Scheduled For", flex: 2, valueFormatter },
    ],
    [valueFormatter]
  );

  return (
    <>
      <Box sx={{ height: 420 }}>
        <ItemsGrid<Item>
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => {
            (document.activeElement as HTMLElement | null)?.blur()
            setSelectedItem(row)
            setSelection([row.id])
            setModalOpen(true)
          }}
          selectionModel={selection}
          onSelectionModelChange={(newSelection) => {
            setSelection(newSelection)
            if (newSelection.length === 0) setSelectedItem(null)
          }}
          pageSizeOptions={[5]}
          defaultPageSize={5}
        />
      </Box>

      <ItemEditorModal
        open={modalOpen}
        item={selectedItem}
        onClose={() => {
          setModalOpen(false)
          setSelectedItem(null)
          setSelection([])
        }}
        onSubmit={onSubmit}
      />
    </>
  );
}
