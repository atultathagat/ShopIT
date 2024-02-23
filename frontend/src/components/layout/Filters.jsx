import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import querySearchParams from '../../helpers/helper';
import PRODUCT_CATRGORIES from '../../constant/constant';
import StarRatings from 'react-star-ratings';

export default function Filters() {

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
let [searchParams] = useSearchParams();
useEffect(() => {
if(searchParams.get('min')) {
    setMin(searchParams.get('min'));
}
if(searchParams.get('max')) {
    setMin(searchParams.get('max'));
}
}, [])
const navigate = useNavigate();
    const filterSubmitButtonClick = e => {
        e.preventDefault();
       searchParams = querySearchParams(searchParams,  'min', min);
       searchParams = querySearchParams(searchParams, 'max', max);
       const path = `${window.location.pathname}?${searchParams.toString()}`;
       navigate(path);
    };

    const handleCheckBoxClick = checkedBox => {
        const checkboxes = document.getElementsByName(checkedBox.name);
        checkboxes.forEach(checkbox => {
            if(checkbox !== checkedBox) {
                checkbox.checked = false;
            }
        });
        if(!checkedBox.checked) {
            if(searchParams.has(checkedBox.name)) {
                searchParams.delete(checkedBox.name);
            }
        } else {
            if(searchParams.has(checkedBox.name)){
                searchParams.set(checkedBox.name, checkedBox.value)
            } else {
                searchParams.append(checkedBox.name, checkedBox.value)
            }
        }
        const path = `${window.location.pathname}?${searchParams.toString()}`;
        navigate(path);
    };

    const defaultCheckedValue = (key, value) => searchParams.get(key) === value;

  return (
    <div className="border p-3 filter">
    <h3>Filters</h3>
    <hr />
    <h5 className="filter-heading mb-3">Price</h5>
    <form
      id="filter_form"
      className="px-2"
      action="your_action_url_here"
      method="get"
    >
      <div className="row">
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Min ($)"
            name="min"
            value={min}
            onChange={e => setMin(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            placeholder="Max ($)"
            name="max"
            value={max}
            onChange={e => setMax(e.target.value)}
          />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-primary" onClick={filterSubmitButtonClick}>GO</button>
        </div>
      </div>
    </form>
    <hr />
    <h5 className="mb-3">Category</h5>

    {PRODUCT_CATRGORIES.map(productCategory =>
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        name="category"
        id="check4"
        defaultChecked={defaultCheckedValue('category', productCategory)}
        value={productCategory}
        onClick={e => handleCheckBoxClick(e.target)}
      />
      <label className="form-check-label" htmlFor="check4">{productCategory}</label>
    </div>)}
    <hr />
    <h5 className="mb-3">Ratings</h5>

   {[5, 4, 3, 2, 1].map(rating => 
   <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        name="ratings"
        id="check7"
        value={rating}
        defaultChecked={defaultCheckedValue('ratings', rating.toString())}
        onClick={e => handleCheckBoxClick(e.target)}
      />
         <StarRatings
          rating={rating}
          starRatedColor="#ffb829"
         numberOfStars={5}
          name='rating'
          starDimension='22px'
          starSpacing='1px'
        />
    </div>)}
  </div>
  );
}
