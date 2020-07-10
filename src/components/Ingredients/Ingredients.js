import React, { useState, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addIngredientHandler = async ingredient => {

    setLoading(true);

    try {

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
  
      setLoading(false);

    } catch (e) {
      setError('Something went wrong!');
      setLoading(false);
    }

  };

  const removeIngredientHandler = async id => {

    setLoading(true);

    try {

      await fetch(`https://react-ingredients-app.firebaseio.com/ingredients/${id}.json`, {
        method: 'DELETE'
      });

      setIngredients((prevIngredients) => prevIngredients.filter(ingredient => ingredient.id !== id));
  
      setLoading(false);

    } catch (e) {
      setError('Something went wrong!');
      setLoading(false);
    }

    
  };

  const filterIngredientsHandler = useCallback(ingredients => setIngredients(ingredients), []);

  const clearError = () => setError('');

  return (

    <div className="App">

      { error && <ErrorModal onClose={ clearError }>{ error }</ErrorModal> }

      <IngredientForm onAddIngredient={ addIngredientHandler } loading={ loading } />

      <section>
        <Search onLoadIngredients={ filterIngredientsHandler } />
        <IngredientList ingredients={ ingredients } onRemoveItem={ removeIngredientHandler } />
      </section>

    </div>

  );

}

export default Ingredients;
