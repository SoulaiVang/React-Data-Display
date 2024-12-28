interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (search: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
return (
    <div className="search-bar">
    <input
        type="text"
        placeholder="Search materials..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
    />
    </div>
);
};

export default SearchBar;