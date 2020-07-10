import React, { useCallback, useReducer } from 'react';

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

const httpReducer = (state, action) => {

  switch (action.type) {

    case 'START':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'SUCCESS':
      return {
        ...state,
        loading: false,
        error: null
      };

    case 'FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload.error
      };

    case 'CLEAR':
      return {
        ...state,
        error: null
      };

    default:
      throw new Error('Should not be here.');

  }

};

const Ingredients = () => {

  const [ingredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null });

  const addIngredientHandler = async ingredient => {

    dispatchHttp({ type: 'START' });

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
  
      dispatchHttp({ type: 'SUCCESS' });

    } catch (e) {
      dispatchHttp({ type: 'FAIL', payload: { error: 'Something went wrong!' } });
    }

  };

  const removeIngredientHandler = async id => {

    dispatchHttp({ type: 'START' });

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
  
      dispatchHttp({ type: 'SUCCESS' });

    } catch (e) {
      dispatchHttp({ type: 'FAIL', payload: { error: 'Something went wrong!' } });
    }

    
  };

  const filterIngredientsHandler = useCallback(ingredients => dispatch({
    type: 'SET',
    payload: {
      ingredients
    }
  }), []);

  const clearError = () => dispatchHttp({ type: 'CLEAR' });

  return (

    <div className="App">

      { httpState.error && <ErrorModal onClose={ clearError }>{ httpState.error }</ErrorModal> }

      <IngredientForm onAddIngredient={ addIngredientHandler } loading={ httpState.loading } />

      <section>
        <Search onLoadIngredients={ filterIngredientsHandler } />
        <IngredientList ingredients={ ingredients } onRemoveItem={ removeIngredientHandler } />
      </section>

    </div>

  );

}

export default Ingredients;
