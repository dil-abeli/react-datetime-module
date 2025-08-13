import type { GridColDef, GridRowParams, GridRowIdGetter, GridValidRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";

type Props<T extends GridValidRowModel> = Readonly<{
  rows: readonly T[]
  columns: readonly GridColDef<T>[]
  getRowId: GridRowIdGetter<T>
  onRowClick?: (row: T) => void
  selectionModel?: GridRowSelectionModel
  onSelectionModelChange?: (newSelection: GridRowSelectionModel) => void
  pageSizeOptions?: number[]
  defaultPageSize?: number
}>

export function ItemsGrid<T extends GridValidRowModel>({
  rows,
  columns,
  getRowId,
  onRowClick,
  selectionModel,
  onSelectionModelChange,
  pageSizeOptions = [5],
  defaultPageSize = 5,
}: Props<T>) {
  const handleRowClick = (params: GridRowParams<T>) => {
    onRowClick?.(params.row)
  }

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      pageSizeOptions={pageSizeOptions}
      initialState={{ pagination: { paginationModel: { pageSize: defaultPageSize } } }}
      getRowId={getRowId}
      getRowHeight={() => 40}
      onRowClick={handleRowClick}
      sx={{
        cursor: 'pointer',
        '& .MuiDataGrid-virtualScroller': {
          overflowY: 'scroll',
          scrollbarGutter: 'stable',
        },
      }}
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={onSelectionModelChange}
    />
  )
}
