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
    fetch('http://localhost:5000/api/find_similar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: query }), // Send query to Flask API
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.title) {
          setReceipe([data]); // Set the response as the recipe list
        } else {
          setReceipe([]); // Clear results if no recipe found
        }
      })
      .catch((error) => {
        console.error('Error fetching recipe:', error);
      });
  };

  const parseIngredientsAndDirections = (str) => {
    try {
      // Replace single quotes with double quotes to make it valid JSON
      return JSON.parse(str.replace(/'/g, '"'));
    } catch (error) {
      console.error('Error parsing ingredients or directions:', error);
      return [];
    }
  };

  const handleItemClick = (recipe) => {
    setSelectedItem({
      ...recipe,
      metadata: {
        ...recipe.metadata,
        ingredients: parseIngredientsAndDirections(recipe.metadata[0].ingredients),
        directions: parseIngredientsAndDirections(recipe.metadata[0].directions),
      },
    });
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
            <div className='contentss'>
              <h3>Recipe Details</h3>
              <p>{selectedItem.title}</p>
              {/* Ensure ingredients exist before rendering */}
              {selectedItem.metadata && selectedItem.metadata.ingredients && selectedItem.metadata.ingredients.length > 0 ? (
                <ol>
                  {selectedItem.metadata.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ol>
              ) : (
                <p>No ingredients available</p>
              )}
              {/* Ensure directions exist before rendering */}
              {selectedItem.metadata && selectedItem.metadata.directions && selectedItem.metadata.directions.length > 0 ? (
                <ol>
                  {selectedItem.metadata.directions.map((direction, index) => (
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
