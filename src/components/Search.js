import React, { useState } from 'react';

function Search({ onSearch, updateParentState }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query === '') {
      updateParentState('healthy');
    } else {
      onSearch(query);
      updateParentState(null);
    }
  };

  const handleTitleClick = () => {
    setQuery(''); // Reset input tìm kiếm
    updateParentState('healthy'); // Đặt lại trạng thái của ứng dụng
    onSearch('healthy'); // Gửi yêu cầu tìm kiếm mặc định
  };

  return (
    <div className="filter">
      <div className="contain">
        <div className="icon" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
          <img
            src="https://w7.pngwing.com/pngs/94/603/png-transparent-chef-s-uniform-cook-computer-icons-restaurant-cooking-thumbnail.png"
            alt=""
          />
          <div className="app-name">
            <h3>Healthy Food</h3>
          </div>
        </div>
        <div className="search">
          <div className="top-row">
            <input
              placeholder="Search Your Recipe"
              type="text"
              name="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="bottom-row">
            <button onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
