export interface MaterialsTableProps {
    data: Record<string, any>[];
    showId: boolean; // Show ID state passed from parent
    selectedRowIndex: number | null;
    onRowClick: (index: number) => void;
}
  