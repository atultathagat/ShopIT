import React, { useEffect, useState } from "react";
import { useGetProductDetailsQuery } from "../../redux/api/productApi";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../layout/loader";
import StarRatings from "react-star-ratings";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/filters/cartSlice";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";

export default function ProductDetails() {
  const params = useParams();
  const dispatch = useDispatch();
  const [activeImage, setActiveImage] = useState("");
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params.id
  );
  const {isUserAuthenticated} = useSelector(state => state.auth);

  const [quantity, setQuantitiy] = useState(1);
  const { product } = data || {};
  useEffect(() => {
    setActiveImage(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);
  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [error]);
  if (isLoading) {
    return <Loader />;
  }

  const increaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber >= product?.stock) {
      return;
    }
    setQuantitiy(count.valueAsNumber + 1);
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");
    if (count.valueAsNumber <= 1) {
      return;
    }
    setQuantitiy(count.valueAsNumber - 1);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0].url,
      stock: product?.stock,
      quantity,
    };
    dispatch(setCartItem(cartItem));
    toast.success("Item added to cart");
  };
  return (
    <div className="row d-flex justify-content-around">
      <div className="col-12 col-lg-5 img-fluid" id="product_image">
        <div className="p-3">
          <img
            className="d-block w-100"
            src={activeImage}
            alt={activeImage}
            width="340"
            height="390"
          />
        </div>
        <div className="row justify-content-start mt-5">
          {product?.images?.map((image) => (
            <div className="col-2 ms-4 mt-2">
              <a role="button">
                <img
                  className={`d-block border rounded p-3 cursor-pointer${
                    image.url === activeImage ? " border-warning" : ""
                  }`}
                  height="100"
                  width="100"
                  src={image?.url}
                  alt={image?.url}
                  onClick={() => setActiveImage(image?.url)}
                />
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 col-lg-5 mt-5">
        <h3>{product?.name}</h3>
        <p id="product_id">Product # {product?._id}</p>

        <hr />

        <div className="d-flex">
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            starDimension="22px"
            starSpacing="1px"
          />
          <span id="no-of-reviews" className="pt-1 ps-2">
            {" "}
            ({product?.numOfReviews} Reviews){" "}
          </span>
        </div>
        <hr />

        <p id="product_price">₹ {product?.price}</p>
        <div className="stockCounter d-inline">
          <span className="btn btn-danger minus" onClick={decreaseQty}>
            -
          </span>
          <input
            type="number"
            className="form-control count d-inline"
            value={quantity}
            readOnly
          />
          <span className="btn btn-primary plus" onClick={increaseQty}>
            +
          </span>
        </div>
        <button
          type="button"
          id="cart_btn"
          className="btn btn-primary d-inline ms-4"
          onClick={setItemToCart}
          disabled={product?.stock <= 0}
        >
          Add to Cart
        </button>

        <hr />

        <p>
          Status:{" "}
          <span
            id="stock_status"
            className={product?.stock > 0 ? "greenColor" : "redColor"}
          >
            {product?.stock > 0 ? "In Stock" : "Out Of Stock"}
          </span>
        </p>

        <hr />

        <h4 className="mt-2">Description:</h4>
        <p>{product?.description}</p>
        <hr />
        <p id="product_seller mb-3">
          Sold by: <strong>Tech</strong>
        </p>

        {isUserAuthenticated ? 
        <NewReview productId={product?._id}/> : <div className="alert alert-danger my-5" type="alert">
          Login to post your review.
        </div>}
      </div>
      {
          product?.reviews?.length > 0 && <ListReviews reviews={product?.reviews}/>
        }
    </div>
  );
}
