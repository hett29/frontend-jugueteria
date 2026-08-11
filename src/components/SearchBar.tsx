import "./SearchBar.css";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="search-container">
      <span className="search-icon">🔍</span>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;