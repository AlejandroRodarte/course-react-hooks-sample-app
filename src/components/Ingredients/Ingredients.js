import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {

    fetch('https://react-ingredients-app.firebaseio.com/ingredients.json')
      .then(res => res.json())
      .then(res => {

        const ingredients = Object.keys(res).map(key => ({
          id: key,
          ...res[key]
        }));

        setIngredients(ingredients);

      });

  }, []);

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

  const filterIngredientsHandler = ingredients => setIngredients(ingredients);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={ addIngredientHandler } />

      <section>
        <Search onLoadIngredients={ filterIngredientsHandler } />
        <IngredientList ingredients={ ingredients } onRemoveItem={ () => {} } />
      </section>
    </div>
  );

}

export default Ingredients;
