import React, { useState, useCallback } from 'react';

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

  const removeIngredientHandler = async id => {

    await fetch(`https://react-ingredients-app.firebaseio.com/ingredients/${id}.json`, {
      method: 'DELETE'
    });

    setIngredients((prevIngredients) => prevIngredients.filter(ingredient => ingredient.id !== id));

  };

  const filterIngredientsHandler = useCallback(ingredients => setIngredients(ingredients), []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={ addIngredientHandler } />

      <section>
        <Search onLoadIngredients={ filterIngredientsHandler } />
        <IngredientList ingredients={ ingredients } onRemoveItem={ removeIngredientHandler } />
      </section>
    </div>
  );

}

export default Ingredients;
