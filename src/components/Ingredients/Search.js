import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

import useHttp from '../../hooks/http';

const Search = React.memo(({ onLoadIngredients }) => {

  const [filter, setFilter] = useState('');

  const inputRef = useRef();

  const [data, error, loading, task, sendRequest] = useHttp();

  useEffect(() => {

    if (!loading && !error) {

      switch (task.type) {
  
        case 'SET_INGREDIENTS':
          const ingredients = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
  
          onLoadIngredients(ingredients);
          break;
      
        case 'NOOP':
          break;
  
        default:
          throw new Error('Should not be here.');
  
      }

    }

  }, [loading, error, task, data, onLoadIngredients]);

  useEffect(() => {

    const timeout = setTimeout(() => {

      if (filter === inputRef.current.value) {

        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;

        sendRequest(`https://react-ingredients-app.firebaseio.com/ingredients.json${query}`, 'GET', null, {
          type: 'SET_INGREDIENTS'
        });

      }

      return () => clearTimeout(timeout);
  
    }, 500);

    }, [filter, onLoadIngredients, inputRef, sendRequest]);

  return (

    <section className="search">

      <Card>

        <div className="search-input">

          <label>Filter by Title</label>

          <input type="text" ref={ inputRef } onChange={ e => {
            const value = e.target.value;
            setFilter(value);
          } } />

        </div>

      </Card>

    </section>

  );

});

export default Search;
