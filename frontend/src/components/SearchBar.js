function SearchBar({searchTerm, setSearchTerm}) {
    return(
        <div className="search-container">
            <input
                type="text"
                placeholder="🔍 Search by AQI Status or AQI Value..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

export default SearchBar;