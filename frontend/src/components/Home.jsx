import React, { useEffect } from 'react';
import MetaData from './layout/MetaData';
import { useGetProductsQuery } from '../redux/api/productApi';
import ProductItem from './product/ProductItem';
import Loader from './layout/loader';
import toast from 'react-hot-toast';
import CustomPagination from './layout/CustomPagination';
import { useSearchParams } from 'react-router-dom';
import Filters from './layout/Filters';

export default function Home() {
  const resPerPage = 4;
  let [searchParams] = useSearchParams();
  const page = +searchParams.get('page') || 1;
  const keyword = searchParams.get('keyword') || '';
  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const category = searchParams.get('category');
  const ratings = searchParams.get('ratings');
  const { data, isLoading, error, isError } = useGetProductsQuery({
    resPerPage,
    page,
    keyword,
    ...(max ? { 'price[lte]': max } : {}),
    ...(min ? { 'price[gte]': min } : {}),
    ...(category ? { category } : {}),
    ...(ratings ? { 'ratings[gte]': ratings } : {})
  });

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <MetaData title="Buy Best Products Online" />
      <div className="row">
        {keyword && (
          <div className="col-6 col-md-3 mt-5">
            <Filters />
          </div>
        )}
        <div
          className={`col-12 col-sm-6 ${keyword ? 'col-md-9' : 'col-md-12'}`}
        >
          <h1 id="products_heading" className="text-secondary">
            {keyword
              ? `${data?.products?.length} products found with the keyword: ${keyword}`
              : 'Latest Products'}
          </h1>

          <section id="products" className="mt-5">
            <div className="row">
              {data?.products?.map(product => (
                <ProductItem product={product} columnSize={keyword ? 4 : 3} />
              ))}
            </div>
          </section>
          <CustomPagination
            filterProductsCount={data?.filterProductsCount}
            resPerPage={data?.resPerPage}
          />
        </div>
      </div>
    </>
  );
}
