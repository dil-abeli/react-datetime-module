import { useMemo, useState } from "react";
import type { GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Item } from "../../store/itemsStore";
import { ItemsGrid } from "../ItemsGrid";
import { ItemEditorModal } from "../ItemEditorModal";
import { Box } from "@mui/material";
import type { ItemUpdatePayload } from "../../types/items";
import DateDisplay from "../DateDisplay";
import { dateIsoSortComparator } from "../../utils/gridSortComparators";

type Props = Readonly<{
  rows: Item[];
  onSubmit: (payload: ItemUpdatePayload) => Promise<unknown> | void;
}>;

export function ScheduledItemsGrid({ rows, onSubmit }: Props) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState<GridRowSelectionModel>([]);

  const columns: GridColDef<Item>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 0.5 },
      { field: "name", headerName: "Name", flex: 1.5 },
      {
        field: "createdAtUtc",
        headerName: "Created",
        flex: 1.5,
        sortComparator: dateIsoSortComparator,
        renderCell: ({ row }) => <DateDisplay utcIso={row.createdAtUtc} />,
      },
      {
        field: "scheduledForUtc",
        headerName: "Scheduled For",
        flex: 1.5,
        sortComparator: dateIsoSortComparator,
        renderCell: ({ row }) => <DateDisplay utcIso={row.scheduledForUtc} />,
      },
    ],
    []
  );

  return (
    <>
      <Box sx={{ height: "80vh", width: "100%" }}>
        <ItemsGrid<Item>
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          onRowClick={(row) => {
            (document.activeElement as HTMLElement | null)?.blur();
            setSelectedItem(row);
            setSelection([row.id]);
            setModalOpen(true);
          }}
          selectionModel={selection}
          onSelectionModelChange={(newSelection) => {
            setSelection(newSelection);
            if (newSelection.length === 0) setSelectedItem(null);
          }}
          pageSizeOptions={[25, 50, 100]}
          defaultPageSize={25}
        />
      </Box>

      <ItemEditorModal
        open={modalOpen}
        item={selectedItem}
        onClose={() => {
          setModalOpen(false);
          setSelectedItem(null);
          setSelection([]);
        }}
        onSubmit={onSubmit}
      />
    </>
  );
}
