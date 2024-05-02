import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PRODUCT_CATRGORIES from "../../constant/constant";
import { useCreateNewProductMutation } from "../../redux/api/productApi";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";
import AdminLayout from "../layout/AdminLayout";

export default function NewProduct() {
  const [createNewProduct, { isLoading, error, data, isSuccess }] = useCreateNewProductMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if(isSuccess) {
        toast.success('Product Created')
        navigate('/admin/products')
    }
  }, [error, isSuccess]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    seller: "",
  });
  const { name, description, price, category, stock, seller } = product;
  const handleSubmitHandler = e => {
    e.preventDefault();
    createNewProduct(product)
  }
  const onChangeHandler = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });
  return (
    <AdminLayout>
        <MetaData  title="Create New Product"/>
              {" "}
      <div className="row wrapper">
        <div className="col-10 col-lg-10 mt-5 mt-lg-0">
          <form className="shadow rounded bg-body" onSubmit={handleSubmitHandler}>
            <h2 className="mb-4">New Product</h2>
            <div className="mb-3">
              <label for="name_field" className="form-label">
                {" "}
                Name{" "}
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChangeHandler}
              />
            </div>

            <div className="mb-3">
              <label for="description_field" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description_field"
                rows="8"
                name="description"
                value={description}
                onChange={onChangeHandler}
              ></textarea>
            </div>

            <div className="row">
              <div className="mb-3 col">
                <label for="price_field" className="form-label">
                  {" "}
                  Price{" "}
                </label>
                <input
                  type="number"
                  id="price_field"
                  className="form-control"
                  name="price"
                  value={price}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="mb-3 col">
                <label for="stock_field" className="form-label">
                  {" "}
                  Stock{" "}
                </label>
                <input
                  type="number"
                  id="stock_field"
                  className="form-control"
                  name="stock"
                  value={stock}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col">
                <label for="category_field" className="form-label">
                  {" "}
                  Category{" "}
                </label>
                <select
                  className="form-select"
                  id="category_field"
                  name="category"
                  value={category}
                  onChange={onChangeHandler}
                >
                  {PRODUCT_CATRGORIES.map((productCategory) => (
                    <option value={productCategory} key={productCategory}>
                      {productCategory}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 col">
                <label for="seller_field" className="form-label">
                  {" "}
                  Seller Name{" "}
                </label>
                <input
                  type="text"
                  id="seller_field"
                  className="form-control"
                  name="seller"
                  value={seller}
                  onChange={onChangeHandler}
                />
              </div>
            </div>
            <button type="submit" className="btn w-100 py-2" disabled={isLoading}>
              {isLoading ? 'Creating...' :  'Create'}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
