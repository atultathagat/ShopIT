import React, { useEffect, useState } from 'react'
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux';
import { calculateOrderCost } from '../../helpers/helper';
import { useCreateNewOrderMutation } from '../../redux/api/orderApi';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'universal-cookie';

export default function PaymentMethod() {
    const { cartItems, shippingInfo } = useSelector((state) => state.cart);
    const [method, setMethod] = useState()
    const {itemsPrice, shippingPrice, taxPrice, totalPrice} = calculateOrderCost(cartItems);
    const [createNewOrder, { isLoading, error, isSuccess ,data }] = useCreateNewOrderMutation();
    const navigate = useNavigate();
    useEffect(() => {
        if (error) {
          toast.error(error?.data?.message);
        }
        if(isSuccess) {
            navigate('/')
        }
      }, [error, isSuccess]);
    const submitButtonHandler = e => {
        e.preventDefault();
        if(method === 'COD') {
            const orderData = {
                shippingInfo,
                orderItems: cartItems,
                itemsPrice,
                shippingAmount: shippingPrice,
                taxAmount: taxPrice,
                totalAmount: totalPrice,
                paymentInfo:{
                    status: 'Not Paid'
                },
                paymentMethod: 'COD'
            }
            createNewOrder({...orderData, token : new Cookies().get('token')})
        }
    }
  return (
    <>
       <MetaData title={"Payment Methods"} />
       <CheckoutSteps shipping confirmOrder payment/>
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body"
          onSubmit={submitButtonHandler}
        >
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={() => setMethod('COD')}
            />
            <label className="form-check-label" for="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={() => setMethod('Card')}
            />
            <label className="form-check-label" for="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100">
            CONTINUE
          </button>
        </form>
      </div>
    </div>
    </>
  )
}
