import SearchBar from "./SearchBar";

interface HeaderProps {
    showId: boolean;
    searchTerm: string;
    onSearchChange: (search: string) => void;
    toggleId: () => void;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const Header = ({ showId, searchTerm, onSearchChange, toggleId, onAdd, onEdit, onDelete }: HeaderProps) => {
  return (
    <div>
        <h1>Materials Table</h1>
      <div className="header-items">
        <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange}></SearchBar>
        <div className="buttons-container">
          <button onClick={() => toggleId()}>
            {showId ? 'Hide ID' : 'Show ID'}
          </button>
          <button onClick={onAdd}>
            Add Data
          </button>
          <button onClick={onEdit}>
            Edit Data
          </button>
          <button onClick={onDelete}>
            Delete Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;