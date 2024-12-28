export interface HeaderProps {
    showId: boolean;
    searchTerm: string;
    onSearchChange: (search: string) => void;
    toggleId: () => void;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
}