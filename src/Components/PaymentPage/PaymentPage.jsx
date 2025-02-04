import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function PaymentPage() {
  const navigate = useNavigate();
  const [mobileNumber, setMobileNumber] = useState('');
  const [isValidNumber, setIsValidNumber] = useState(true);
  const data = useSelector((store) => store.cart.cart);

  let totalMRP = 0;
  let discountMRP = 0;
  const numberOfItems = data.length;

  for (let i = 0; i < data.length; i++) {
    totalMRP += data[i].price.sp * data[i].qty;
    discountMRP += data[i].price.mrp * data[i].qty;
  }

  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => setRazorpayLoaded(true); 
      script.onerror = () => alert('Failed to load Razorpay script');
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Razorpay script not loaded');
      return;
    }

    try {
      const orderUrl = 'https://menshopbackend.onrender.com/api/payment';
      const { data: orderData } = await axios.post(orderUrl, { amount: totalMRP });

      const options = {
        key: 'rzp_test_Xa1fAmRtAIprCh', 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Company Name',
        description: 'Payment for Order',
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verificationResponse = await axios.post(
              'https://menshopbackend.onrender.com/api/payment/verify',
              response,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );

            if (verificationResponse.data.message === 'Payment verified successfully') {
              console.log('Payment verified successfully');
              navigate('/order', { state: { orderDetails: orderData } });  
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('There was an error verifying your payment. Please try again.');
          }
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error creating order', error);
      alert('There was an error creating the order. Please try again.');
    }
  };

  const handleAddNumber = (e) => {
    const re = /^[0-9\b]+$/;
    const value = e.target.value;
    if (value === '' || re.test(value)) {
      setMobileNumber(value);
      setIsValidNumber(true);
    } else {
      setIsValidNumber(false);
    }
  };

  const isCartEmpty = data.length === 0;

  return (
    <div className="PaymentPageMain">
      <div className="PaymentPageFlex">
        <div className="ProductPricesDiv">
          {data.length !== 0 ? (
            <div className="ProductPricesDivInside">
              <p className="priceDiv">PRICE DETAILS ({numberOfItems} item)</p>
              <div className="ProductFlex">
                <p>Total MRP</p>
                <p>₹{totalMRP}</p>
              </div>
              <div className="ProductFlex">
                <p>Discount on MRP</p>
                <p className="greenText">-₹{discountMRP - totalMRP}</p>
              </div>
              <div className="ProductFlex marginBtm">
                <p>Convenience Fee <span className="redText"> Know More</span></p>
                <p><span className="LineonText">₹99</span> <span className="greenText">FREE</span></p>
              </div>
              <div className="ProductFlex totolAmt">
                <p>Total Amount</p>
                <p>₹{totalMRP}</p>
              </div>
            </div>
          ) : (
            <div className="ProductPricesDivInside">
              <p className="noCartDataFound totolAmt">Your Cart is Empty</p>
            </div>
          )}
          <Box sx={{ margin: 2 }}>
            <TextField
              fullWidth
              label="Enter Mobile Number"
              variant="outlined"
              value={mobileNumber}
              onChange={handleAddNumber}
              error={!isValidNumber}
              helperText={isValidNumber ? '' : 'Please enter a valid mobile number'}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handlePayment}
            disabled={isCartEmpty || !isValidNumber}
          >
            Proceed to Pay
          </Button>
        </div>
      </div>
    </div>
  );
}
