import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(({ onLoadIngredients }) => {

  const [filter, setFilter] = useState('');

  useEffect(() => {

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

  }, [filter, onLoadIngredients]);

  return (

    <section className="search">

      <Card>

        <div className="search-input">

          <label>Filter by Title</label>

          <input type="text" onChange={ e => {
            const value = e.target.value;
            setFilter(value);
          } } />

        </div>

      </Card>

    </section>

  );

});

export default Search;
