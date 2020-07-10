import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);

  const addIngredientHandler = async ingredient => {

    const data = await fetch('https://react-ingredients-app.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await data.json();

    setIngredients((prevIngredients) => [...prevIngredients, {
      id: json.name,
      ...ingredient
    }]);

  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={ addIngredientHandler } />

      <section>
        <Search />
        <IngredientList ingredients={ ingredients } onRemoveItem={ () => {} } />
      </section>
    </div>
  );

}

export default Ingredients;
