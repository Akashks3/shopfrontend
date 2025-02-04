import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CartPage.css';

import { deleteItemCart } from '../../Redux/Cart/Action';
import { useNavigate } from 'react-router-dom';
import { addCart, removeOneCart } from '../../Redux/Cart/Action';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CartPage() {
  const navigate = useNavigate();
  const data = useSelector((store) => store.cart.cart);  
  const [totalMRP, setTotalMRP] = useState(0);  
  
  let total = 0;  

  
  for (let i = 0; i < data.length; i++) {
    total += data[i].price.sp * data[i].qty;
  }

  const dispatch = useDispatch();

  useEffect(() => {
    setTotalMRP(total);  
  }, [total]);

  const handleAddBag = (e) => {
    dispatch(addCart(e));  
    toast.success("Product Added To Cart Successfully");
  };

  const handleRemoveQuantity = (e) => {
    dispatch(removeOneCart(e));  
    toast.info("Product Quantity Decreased");
  };

  const handleDeleteItem = (id) => {
    dispatch(deleteItemCart(id));  
    toast.error("Product Removed From Cart");
  };

  return (
    <div>
      {
        data.length !== 0 ? (
          <div className='CartPage'>
          
            <div className='CartProdHeading'>
              <div><p>Product</p></div>
              <div><p>Price</p></div>
              <div><p>Quantity</p></div>
              <div><p>Total</p></div>
              <div><p>Delete</p></div>
            </div>

          
            {data.map((e, i) => (
              <div className='CartProdHeading IndividualProdCart' key={i}>
                
                <div onClick={() => { navigate(`/${e.tag}/${e.id}`) }} >
                  <img src={e.images[0]} alt="" />
                </div>
                <div onClick={() => { navigate(`/${e.tag}/${e.id}`) }} >
                  <p>{e.name}</p>
                </div>
                
                <div>
                  <p>₹ {e.price.sp}</p>
                </div>
                
                <div >
                  <div className='CartQuantityIncDec'>
                    <div id='box'>
                      <div onClick={() => handleAddBag(e)} id="box1">+</div>
                      <div><p id="quantity">{e.qty}</p></div>
                      <div onClick={() => handleRemoveQuantity(e)} id="box1">-</div>
                    </div>
                  </div>
                </div>
              
                <div>
                  <p>₹ {e.qty * e.price.sp}</p>
                </div>
                
                <div className='CartRemove' onClick={() => handleDeleteItem(e.id)}>
                  Delete
                </div>
              </div>
            ))}

            
            <div className='SubTotalDiv'>
              <div><p>Subtotal</p></div>
              <div><p>₹ {totalMRP}</p></div>
            </div>

          
            <div className='Checkout'>
              <div className="hbtn hb-fill-right-br" onClick={() => navigate("/")}>
                <p>Continue Shopping</p>
              </div>
              <div className="hbtn hb-fill-right-br" onClick={() => navigate("/shipping")}>
                <p>Proceed to Checkout</p>
              </div>
            </div>

          </div>
        ) : (
          <div className='EmptyCart'>
            <p>Your Cart is Empty</p>
          </div>
        )
      }

  
      <ToastContainer />
    </div>
  );
}
