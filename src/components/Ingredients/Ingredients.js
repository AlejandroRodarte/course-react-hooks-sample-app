import React, { useCallback, useReducer, useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

import useHttp from '../../hooks/http';

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
  const [data, error, loading, task, sendRequest, clear] = useHttp();

  useEffect(() => {

    if (!loading && !error) {

      switch (task.type) {
        
        case 'ADD_INGREDIENT':
          dispatch({
            type: 'ADD',
            payload: {
              ingredient: {
                id: data.name,
                ...task.payload
              }
            }
          });
          break;
  
        case 'REMOVE_INGREDIENT':
          dispatch({
            type: 'DELETE',
            payload: task.payload
          });
          break;
  
        case 'NOOP':
          break;
  
        default:
          throw new Error('Should not be here.');
  
      }

    }

  }, [data, task, loading, error]);

  const addIngredientHandler = useCallback(async ingredient => {
    await sendRequest('https://react-ingredients-app.firebaseio.com/ingredients.json', 'POST', JSON.stringify(ingredient), {
      type: 'ADD_INGREDIENT',
      payload: ingredient
    });
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(async id => {
    await sendRequest(`https://react-ingredients-app.firebaseio.com/ingredients/${id}.json`, 'DELETE', null, {
      type: 'REMOVE_INGREDIENT',
      payload: {
        id
      }
    });    
  }, [sendRequest]);

  const filterIngredientsHandler = useCallback(ingredients => dispatch({
    type: 'SET',
    payload: {
      ingredients
    }
  }), []);

  const ingredientList = useMemo(() => <IngredientList ingredients={ ingredients } onRemoveItem={ removeIngredientHandler } />, [ingredients, removeIngredientHandler]);

  return (

    <div className="App">

      { error && <ErrorModal onClose={ clear }>{ error }</ErrorModal> }

      <IngredientForm onAddIngredient={ addIngredientHandler } loading={ loading } />

      <section>
        <Search onLoadIngredients={ filterIngredientsHandler } />
        { ingredientList }
      </section>

    </div>

  );

}

export default Ingredients;
