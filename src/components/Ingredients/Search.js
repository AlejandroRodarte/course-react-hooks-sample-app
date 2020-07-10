import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {

  const [filter, setFilter] = useState('');

  const inputRef = useRef();

  useEffect(() => {

    setTimeout(() => {

      if (filter === inputRef.current.value) {

        const query = filter.length === 0 ? '' : `?orderBy="title"&equalTo="${filter}"`;
    
        fetch(`https://react-ingredients-app.firebaseio.com/ingredients.json${query}`)
          .then(res => res.json())
          .then(res => {
    
            const ingredients = Object.keys(res).map(key => ({
              id: key,
              ...res[key]
            }));
    
            onLoadIngredients(ingredients);
    
          });

      }
  
    }, 500);

    }, [filter, onLoadIngredients, inputRef]);

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
