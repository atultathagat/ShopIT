import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import {useNavigate, useSearchParams} from 'react-router-dom';
export default function CustomPagination({resPerPage, filterProductsCount}) {
    const [currentPage, setCurrentPage] = useState();
    const navigate = useNavigate();
    let [searchParams]  = useSearchParams();
    const page = (+searchParams.get('page')) || 1;
    useEffect(() => setCurrentPage(page), []);
const setCurrentPageNumber = pageNumber => {
    setCurrentPage(pageNumber);
    if(searchParams?.has('page')) {
        searchParams?.set('page', pageNumber);
    } else {
        searchParams.append('page', pageNumber);
    }
    const path = `${window.location.pathname}?${searchParams.toString()}`;
    navigate(path);
};
  return (
    <div className='d-flex justify-content-center my-5'>
    {filterProductsCount > resPerPage &&
<Pagination
activePage={currentPage}
itemsCountPerPage={resPerPage}
totalItemsCount={filterProductsCount}
pageRangeDisplayed={5}
onChange={setCurrentPageNumber}
nextPageText='Next'
prevPageText='Prev'
lastPageText='Last'
firstPageText='First'
itemClass='page-item'
linkClass='page-link'
/>}
  </div>
  );
}
