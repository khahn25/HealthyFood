import React, { useEffect } from 'react';

function RecipeList({ receipe, favoritedItems, onItemClick, onFavorite, onSearch, childProp }) {
  useEffect(() => {
    onSearch(childProp);
  }, [childProp]);

  

  return (
    <div className='recipe'>
      {receipe.length > 0 && childProp ? <h1>Food Recommendation</h1> : <h1>Search results:</h1>}
      <div className="data-grid">
        {receipe.map((recipe) => (
          <div key={recipe.uri} className="grid-item" onClick={() => onItemClick(recipe)}>
            {/* <img src={recipe.image} alt="" /> */}
            <p>{recipe.title}</p>
            {/* <button
              className={`heart-button ${favoritedItems.some((item) => item.uri === recipe.uri) ? 'active' : ''}`}
              onClick={(e) => onFavorite(e, recipe)}
            >
              {favoritedItems.some((item) => item.uri === recipe.uri) ? '❤️' : '🤍'}
            </button> */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
