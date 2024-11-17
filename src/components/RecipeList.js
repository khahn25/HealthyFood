import React, { useEffect } from 'react';

function RecipeList({ receipe, favoritedItems, onItemClick, onFavorite, onSearch, childProp, loading }) {
  useEffect(() => {
    if (childProp) {
      onSearch(childProp);
    }
  }, [childProp]);

  return (
    <div className="recipe">
      {loading ? (
        <h1>Loading...</h1>
      ) : receipe.length > 0 && childProp ? (
        <h1>Food Recommendation</h1>
      ) : (
        <h1>Search results:</h1>
      )}
      <div className="data-grid">
        {receipe.length === 0 && !loading && <p>No recipes found for the given query.</p>}
        {receipe.map((recipe, index) => (
          <div key={index} className="grid-item" onClick={() => onItemClick(recipe)}>
            <h3>{recipe.title}</h3>
            <p><strong>Ingredients:</strong></p>
            <ul>
              {recipe.ingredients.map((ingredient, idx) => (
                <li key={idx}>{ingredient}</li>
              ))}
            </ul>
            <p><strong>Directions:</strong></p>
            <ol>
              {recipe.directions.map((direction, idx) => (
                <li key={idx}>{direction}</li>
              ))}
            </ol>
            {/* <button onClick={(e) => onFavorite(e, recipe)}>Favorite</button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
