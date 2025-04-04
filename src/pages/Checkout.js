import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import Container from "../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { config } from "../utils/axiosConfig";
import {
  createAnOrder,
  deleteUserCart,
  getUserCart,
  resetState,
} from "../features/user/userSlice";

// Geolocation Schema
let shippingSchema = yup.object({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  address: yup.string().required("Address Details are Required"),
  state: yup.string().required("State is Required"),
  city: yup.string().required("City is Required"),
  country: yup.string().required("Country is Required"),
  pincode: yup.number("Pincode No is Required").required().positive().integer(),
});

const Checkout = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [totalAmount, setTotalAmount] = useState(null);
  const [shippingInfo, setShippingInfo] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({
    razorpayPaymentId: "",
    razorpayOrderId: "",
  });
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState({
    city: "",
    state: "",
    country: "India", // Default country
  });

  // Get total amount for the order
  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotalAmount(sum);
    }
  }, [cartState]);

  // Geolocation function to get current location
  const getUserCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // You can use a geocoding API here like Google Maps API to get the address based on coordinates
        const res = await axios.get(
          `https://www.google.co.in/maps/@12.9959571,79.8072583,14z?entry=ttu&g_ep=EgoyMDI1MDQwMS4wIKXMDSoASAFQAw%3D%3D`
        );

        if (res.data.results.length > 0) {
          const addressComponents = res.data.results[0].address_components;
          const city =
            addressComponents.find((comp) => comp.types.includes("locality"))
              ?.long_name || "";
          const state =
            addressComponents.find((comp) =>
              comp.types.includes("administrative_area_level_1")
            )?.long_name || "";
          setUserLocation({ ...userLocation, city, state });
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Run geolocation when the component mounts
  useEffect(() => {
    getUserCurrentLocation();
  }, []);

  const getTokenFromLocalStorage = localStorage.getItem("customer")
    ? JSON.parse(localStorage.getItem("customer"))
    : null;

  const config2 = {
    headers: {
      Authorization: `Bearer ${
        getTokenFromLocalStorage !== null ? getTokenFromLocalStorage.token : ""
      }`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    dispatch(getUserCart(config2));
  }, []);

  useEffect(() => {
    if (
      authState?.orderedProduct?.order !== null &&
      authState?.orderedProduct?.success === true
    ) {
      navigate("/my-orders");
    }
  }, [authState]);

  const [cartProductState, setCartProductState] = useState([]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      address: "",
      state: userLocation.state, // Prefill state from geolocation
      city: userLocation.city, // Prefill city from geolocation
      country: userLocation.country, // Prefill country
      pincode: "",
      other: "",
    },
    validationSchema: shippingSchema,
    onSubmit: (values) => {
      setShippingInfo(values);
      localStorage.setItem("address", JSON.stringify(values));
      setTimeout(() => {
        checkOutHandler();
      }, 300);
    },
  });

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let items = [];
    for (let index = 0; index < cartState?.length; index++) {
      items.push({
        product: cartState[index].productId._id,
        quantity: cartState[index].quantity,
        color: cartState[index].color._id,
        price: cartState[index].price,
      });
    }
    setCartProductState(items);
  }, []);

  const checkOutHandler = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }
    const result = await axios.post(
      "https://menshopbackend-1.onrender.com/api/user/order/checkout",
      { amount: totalAmount + 100 },
      config
    );

    if (!result) {
      alert("Something Went Wrong");
      return;
    }

    const { amount, id: order_id, currency } = result.data.order;

    const options = {
      key: "rzp_test_Xa1fAmRtAIprCh",
      amount: amount,
      currency: currency,
      name: "M",
      description: "Test Transaction",

      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
        };

        const result = await axios.post(
          "https://menshopbackend-1.onrender.com/api/user/order/paymentVerification",
          data,
          config
        );

        dispatch(
          createAnOrder({
            totalPrice: totalAmount,
            totalPriceAfterDiscount: totalAmount,
            orderItems: cartProductState,
            paymentInfo: result.data,
            shippingInfo: JSON.parse(localStorage.getItem("address")),
          })
        );
        dispatch(deleteUserCart(config2));
        localStorage.removeItem("address");
        dispatch(resetState());
      },
      prefill: {
        name: "M",
        email: "your@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "developer's corner office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container class1="checkout-wrapper py-5 home-wrapper-2">
      <div className="row">
        <div className="col-7">
          <div className="checkout-left-data">
            <h3 className="website-name">Cakes</h3>
            <nav
              style={{ "--bs-breadcrumb-divider": ">" }}
              aria-label="breadcrumb"
            >
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link className="text-dark total-price" to="/cart">
                    Cart
                  </Link>
                </li>
                &nbsp; /&nbsp;
                <li
                  className="breadcrumb-item total-price active"
                  aria-current="page"
                >
                  Information
                </li>
                &nbsp; /&nbsp;
                <li className="breadcrumb-item total-price active">Shipping</li>
                &nbsp; /&nbsp;
                <li
                  className="breadcrumb-item total-price active"
                  aria-current="page"
                >
                  Payment
                </li>
              </ol>
            </nav>
            <h4 className="title total">Contact Information</h4>
            <p className="user-details total">your@gmail.com</p>
            <h4 className="mb-3">Shipping Address</h4>
            <form
              onSubmit={formik.handleSubmit}
              className="d-flex gap-15 flex-wrap justify-content-between"
            >
              <div className="w-100">
                <select
                  className="form-control form-select"
                  name="country"
                  value={formik.values.country}
                  onChange={formik.handleChange("country")}
                  onBlur={formik.handleBlur("country")}
                >
                  <option value="" selected disabled>
                    Select Country
                  </option>
                  <option value="India">India</option>
                </select>
                <div className="error ms-2 my-1">
                  {formik.touched.country && formik.errors.country}
                </div>
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="First Name"
                  className="form-control"
                  name="firstname"
                  value={formik.values.firstname}
                  onChange={formik.handleChange("firstname")}
                  onBlur={formik.handleBlur("firstname")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.firstname && formik.errors.firstname}
                </div>
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="form-control"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange("lastname")}
                  onBlur={formik.handleBlur("lastname")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.lastname && formik.errors.lastname}
                </div>
              </div>
              <div className="w-100">
                <input
                  type="text"
                  placeholder="Address"
                  className="form-control"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange("address")}
                  onBlur={formik.handleBlur("address")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.address && formik.errors.address}
                </div>
              </div>
              <div className="w-100">
                <input
                  type="text"
                  placeholder="Apartment, Suite, etc."
                  className="form-control"
                  name="other"
                  value={formik.values.other}
                  onChange={formik.handleChange("other")}
                  onBlur={formik.handleBlur("other")}
                />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="City"
                  className="form-control"
                  name="city"
                  value={formik.values.city || userLocation.city}
                  onChange={formik.handleChange("city")}
                  onBlur={formik.handleBlur("city")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.city && formik.errors.city}
                </div>
              </div>
              <div className="flex-grow-1">
                <select
                  className="form-control form-select"
                  name="state"
                  value={formik.values.state || userLocation.state}
                  onChange={formik.handleChange("state")}
                  onBlur={formik.handleBlur("state")}
                >
                  <option value="" selected disabled>
                    Select State
                  </option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Andaman and Nicobar Islands">
                    Andaman and Nicobar Islands
                  </option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Dadra and Nagar Haveli and Daman and Diu">
                    Dadra and Nagar Haveli and Daman and Diu
                  </option>
                  <option value="Lakshadweep">Lakshadweep</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Puducherry">Puducherry</option>
                </select>
                <div className="error ms-2 my-1">
                  {formik.touched.state && formik.errors.state}
                </div>
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  placeholder="Pincode"
                  className="form-control"
                  name="pincode"
                  value={formik.values.pincode}
                  onChange={formik.handleChange("pincode")}
                  onBlur={formik.handleBlur("pincode")}
                />
                <div className="error ms-2 my-1">
                  {formik.touched.pincode && formik.errors.pincode}
                </div>
              </div>
              <div className="w-100">
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/cart" className="text-dark">
                    <BiArrowBack className="me-2" />
                    Return to Cart
                  </Link>
                  <Link to="/cart" className="button">
                    Continue to Shipping
                  </Link>
                  <button className="button" type="submit">
                    Place Order
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Cart Items Section */}
        <div className="col-5">
          <div className="border-bottom py-4">
            {cartState &&
              cartState?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="d-flex gap-10 mb-2 align-items-center"
                  >
                    <div className="w-75 d-flex gap-10">
                      <div className="w-25 position-relative">
                        <span
                          style={{ top: "-10px", right: "2px" }}
                          className="badge bg-secondary text-white rounded-circle p-2 position-absolute"
                        >
                          {item?.quantity}
                        </span>
                        <img
                          src={item?.productId?.images[0]?.url}
                          width={100}
                          height={100}
                          alt="product"
                        />
                      </div>
                      <div>
                        <h5 className="total-price">
                          {item?.productId?.title}
                        </h5>
                        <p className="total-price">{item?.color?.title}</p>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="total">
                        Rs. {item?.price * item?.quantity}
                      </h5>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="border-bottom py-4">
            <div className="d-flex justify-content-between align-items-center">
              <p className="total">Subtotal</p>
              <p className="total-price">
                Rs. {totalAmount ? totalAmount : "0"}
              </p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0 total">Shipping</p>
              <p className="mb-0 total-price">Rs. 20</p>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center border-bottom py-4">
            <h4 className="total">Total</h4>
            <h5 className="total-price">
              Rs. {totalAmount ? totalAmount + 100 : "0"}
            </h5>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Checkout;
