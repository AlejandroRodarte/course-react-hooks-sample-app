import React, { useState, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (state, action) => {

  switch (action.type) {

    case 'SET':
      return action.payload.ingredients;

    case 'ADD':
      return [...state, action.payload.ingredient];

    case 'DELETE':
      return state.filter(value => value.id !== action.payload.id);

    default:
      throw new Error('Should not be here.');

  }

};

const Ingredients = () => {

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
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
  
      dispatch({
        type: 'ADD',
        payload: {
          ingredient: {
            id: json.name,
            ...ingredient
          }
        }
      });
  
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

      dispatch({
        type: 'DELETE',
        payload: {
          id
        }
      });
  
      setLoading(false);

    } catch (e) {
      setError('Something went wrong!');
      setLoading(false);
    }

    
  };

  const filterIngredientsHandler = useCallback(ingredients => dispatch({
    type: 'SET',
    payload: {
      ingredients
    }
  }), []);

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
