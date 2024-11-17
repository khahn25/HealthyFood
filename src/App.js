import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/Search';
import RecipeList from './components/RecipeList';

function App() {
  const [dummy, setDummy] = useState('healthy');
  const [selectedItem, setSelectedItem] = useState(null);
  const [receipe, setReceipe] = useState([]);
  const [storedItems, setStoredItems] = useState([]);
  const [favoritedItems, setFavoritedItems] = useState([]);

  useEffect(() => {
    // Fetch stored items from local storage when the component mounts
    const storedItemsString = localStorage.getItem('selectedItems');
    if (storedItemsString) {
      const items = JSON.parse(storedItemsString);
      setStoredItems(items);
    }

    // Fetch favorited items from local storage when the component mounts
    const favoritedItemsString = localStorage.getItem('favoritedItems');
    if (favoritedItemsString) {
      const items = JSON.parse(favoritedItemsString);
      setFavoritedItems(items);
    }
  }, []);

  const updateParentState = (newValue) => {
    setDummy(newValue);
  };

  const getReceipe = (query) => {
    fetch('http://192.168.1.8:5000/api/find_similar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }), // Send query to Flask API
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Kiểm tra dữ liệu trả về
        if (data && data.length > 0 && data[0].title) {
          const recipes = data[0].title.map((title, index) => ({
            title,
            ingredients: JSON.parse(data[0].metadata[index].ingredients.replace(/'/g, '"')),
            directions: JSON.parse(data[0].metadata[index].directions.replace(/'/g, '"')),
            ner: JSON.parse(data[0].metadata[index].NER.replace(/'/g, '"')),
          }));
          setReceipe(recipes); // Cập nhật kết quả vào state
        } else {
          setReceipe([]); // Nếu không có dữ liệu, xóa kết quả
        }
      })
      .catch((error) => {
        console.error('Error fetching recipe:', error);
      });
  };

  const handleItemClick = (recipe) => {
    setSelectedItem(recipe);
  };

  const closePopup = () => {
    setSelectedItem(null);
  };

  const favorite = (e, recipe) => {
    e.stopPropagation();
    const selectedItemString = JSON.stringify(recipe);

    const isFavorited = favoritedItems.some((item) => item.uri === recipe.uri);

    if (isFavorited) {
      const updatedItems = storedItems.filter((item) => item !== selectedItemString);
      localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
      const updatedFavoritedItems = favoritedItems.filter((item) => item.uri !== recipe.uri);
      localStorage.setItem('favoritedItems', JSON.stringify(updatedFavoritedItems));
      setFavoritedItems(updatedFavoritedItems);
    } else {
      const updatedItems = [...storedItems, selectedItemString];
      localStorage.setItem('selectedItems', JSON.stringify(updatedItems));
      const updatedFavoritedItems = [...favoritedItems, recipe];
      localStorage.setItem('favoritedItems', JSON.stringify(updatedFavoritedItems));
      setFavoritedItems(updatedFavoritedItems);
    }
  };

  return (
    <>
      <Search onSearch={getReceipe} updateParentState={updateParentState} />
      <RecipeList
        onSearch={getReceipe}
        receipe={receipe}
        favoritedItems={favoritedItems}
        onItemClick={handleItemClick}
        onFavorite={favorite}
        childProp={dummy}
      />

      {selectedItem && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <img src={selectedItem.image} alt="" />
            <div className="contentss">
              <h3>Recipe Details</h3>
              <p>{selectedItem.title}</p>
              {/* Ensure ingredients exist before rendering */}
              {selectedItem.ingredients && selectedItem.ingredients.length > 0 ? (
                <ol>
                  {selectedItem.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ol>
              ) : (
                <p>No ingredients available</p>
              )}
              {/* Ensure directions exist before rendering */}
              {selectedItem.directions && selectedItem.directions.length > 0 ? (
                <ol>
                  {selectedItem.directions.map((direction, index) => (
                    <li key={index}>{direction}</li>
                  ))}
                </ol>
              ) : (
                <p>No directions available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
