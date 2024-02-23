import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Search() {
    const [keyword, setKeyWord] = useState();
    const navigate = useNavigate();
const handleSubmit = e => {
    e.preventDefault();
    const searchKeyWord = keyword.trim();
    if(searchKeyWord) {
    const path = `${window.location.pathname}?keyword=${searchKeyWord}`;
    navigate(path);
    } else {
        navigate('/');
    }
};
  return (
    <form action="your_search_action_url_here" method="get">
    <div className="input-group">
      <input
        type="text"
        id="search_field"
        aria-describedby="search_btn"
        className="form-control"
        placeholder="Enter Product Name ..."
        name="keyword"
        value={keyword}
        onChange={e => setKeyWord(e?.target?.value)}
      />
      <button id="search_btn" className="btn" type="submit" onClick={handleSubmit}>
        <i className="fa fa-search" aria-hidden="true" />
      </button>
    </div>
  </form>
  );
}
