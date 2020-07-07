import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

const IngredientForm = React.memo(props => {

  const [formState, setFormState] = useState({
    title: '',
    amount: ''
  });

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">

      <Card>

        <form onSubmit={submitHandler}>

          <div className="form-control">

            <label htmlFor="title">Name</label>

            <input type="text" id="title" value={ formState.title } onChange={ e => {
              const newTitle = e.target.value;
              setFormState((prevState) => ({ title: newTitle, amount: prevState.amount }))
            } } />

          </div>

          <div className="form-control">

            <label htmlFor="amount">Amount</label>

            <input type="number" id="amount" value={ formState.amount } onChange={ e => {
              const newAmount = e.target.value;
              setFormState((prevState) => ({ title: prevState.title, amount: newAmount }));
            } } />

          </div>

          <div className="ingredient-form__actions">

            <button type="submit">Add Ingredient</button>

          </div>

        </form>

      </Card>

    </section>
  );
});

export default IngredientForm;
