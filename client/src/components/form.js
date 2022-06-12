import { useState, useEffect } from 'react';
import menuForm from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import 'react-dropdown/style.css';
import './form.css';

function Form({ updateSubmitted }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dish, setDish] = useState('');
  const [invalidInput, setInvalidInput] = useState(false)
  const [categorySelected, setCategorySelected] = useState('');

  const validateInput = () => {
    if(!name || !email || !dish || !categorySelected || categorySelected === 'Select An Option') {
      setInvalidInput(true)
      return false
    }
    return true
  }

  const saveInput = (e) => {
    if (e.target.name === 'name') {
      setName(e.target.value);
    } else if (e.target.name === 'email') {
      setEmail(e.target.value);
    } else {
      setDish(e.target.value);
    }
  };

  const onChangeDropDown = (e) => {
    setCategorySelected(e.target.value);
  };

  useEffect(() => {
    if(invalidInput) {
      setInvalidInput(false)
    } 
  }, [categorySelected])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validInput = validateInput();
    if(!validInput) {
      return 
    }
    let bodyToSend = {
      name: name,
      email: email,
      dish: { name: dish, category: categorySelected },
    };
    const response = await fetch('/api', {
      method: 'POST',
      body: JSON.stringify(bodyToSend),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      updateSubmitted();
      localStorage.setItem('userId', data._id);
      console.log(data);
    }
  };
  return (
    <form onSubmit={handleSubmit} className={"form-container"}>
        <div className='form-header-container'>
          <h3 className='form-header'>Form</h3>
        </div>
        { invalidInput ? <div className='form-error-message-container'><p className='form-error-message'>Invalid Input. Please Fill Out All The Fields.</p></div> : null }
        <div className='form-label-container'>
          <label className='form-label'>
            Name<span className='log-in-lable-star '>*</span>
          </label>
          <input
            className='form-input'
            onChange={saveInput}
            type='text'
            name='name'
            value={name}
            required={true}
          ></input>
        </div>
        <div className='form-label-container'>
          <label className='form-label'>
            Email<span className='log-in-lable-star '>*</span>
          </label>
          <input
            className='form-input'
            onChange={saveInput}
            type='email'
            name='email'
            value={email}
            required={true}
          ></input>
        </div>
        <div className='form-dropdown-container form-label-container'>
          <label className='form-label'>
            Item Type<span className='log-in-lable-star '>*</span>
          </label>
          <menuForm.Select
            onChange={onChangeDropDown}
            aria-label='Default select example'
            className='form-dropdown-menu form-input'
          >
            <option>Select An Option</option>
            <option value='Appetizer'>Appetizer</option>
            <option value='Entre'>Entre</option>
            <option value='Dessert'>Dessert</option>
            <option value='Drink'>Drink</option>
            <option value='Utensils'>Utensils</option>
          </menuForm.Select>
        </div>
        <div className='form-label-container'>
          <label className='form-label'>
            Item<span className='log-in-lable-star '>*</span>
          </label>
          <input
            className='form-input'
            onChange={saveInput}
            type='text'
            name='dish'
            value={dish}
            required={true}
          ></input>
        </div>
        <div className='form-button-container'>
          <button className={"form-submit-btn"}>submit</button>
        </div>
    </form>
  );
}

export default Form;
