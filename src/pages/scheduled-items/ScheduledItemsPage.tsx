import { Typography } from "@mui/material";
import { ScheduledItemsGrid } from "../../components/scheduled-items-grid/ScheduledItemsGrid";
import { useItemsQuery, useUpdateItemMutation } from "../../queries/hooks";
import { useCallback } from "react";
import type { ItemUpdatePayload } from "../../types/items";

export function ScheduledItemsPage() {
  const { data: items = [] } = useItemsQuery();
  const { mutateAsync } = useUpdateItemMutation();

  const handleSubmit = useCallback(
    async ({ id, name, scheduledForUtc }: ItemUpdatePayload) => {
      const current = items.find((i) => i.id === id);
      if (!current) return;
      await mutateAsync({ ...current, name, scheduledForUtc });
    },
    [items, mutateAsync]
  );

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Scheduled Items
      </Typography>
      <ScheduledItemsGrid rows={items} onSubmit={handleSubmit} />
    </>
  );
}
