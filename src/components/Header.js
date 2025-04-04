import React, { useEffect, useState } from "react";  
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaHeart} from "react-icons/fa"; 
import { GiShoppingBag } from "react-icons/gi";

import { useDispatch, useSelector } from "react-redux";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import { getAProduct } from "../features/products/productSlilce";
import { getUserCart } from "../features/user/userSlice";
import { Box, Typography, Button, IconButton, Badge } from "@mui/material";

const Header = () => {
  const dispatch = useDispatch();
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const authState = useSelector((state) => state?.auth);
  const [total, setTotal] = useState(null);
  const [paginate, setPaginate] = useState(true);
  const productState = useSelector((state) => state?.product?.product);
  const navigate = useNavigate();

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

  const [productOpt, setProductOpt] = useState([]);
  useEffect(() => {
    let sum = 0;
    for (let index = 0; index < cartState?.length; index++) {
      sum = sum + Number(cartState[index].quantity) * cartState[index].price;
      setTotal(sum);
    }
  }, [cartState]);

  useEffect(() => {
    let data = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      data.push({ id: index, prod: element?._id, name: element?.title });
    }
    setProductOpt(data);
  }, [productState]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>

      <Box sx={{ py: 2, bgcolor: "#607d8b" }}>
        <Box className="container-xxl" display="flex" alignItems="center">
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
               M
              </Link>
            </Typography>
          </Box>
          <Box sx={{ flex: 2 }}>
            <Box sx={{ display: "flex", alignItems:"center",borderRadius:"28rem"}}>
              <Typeahead
                id="pagination-example"
                onPaginate={() => console.log("Results paginated")}
                onChange={(selected) => {
                  navigate(`/product/${selected[0]?.prod}`);
                  dispatch(getAProduct(selected[0]?.prod));
                }}
                options={productOpt}
                paginate={paginate}
                labelKey={"name"}
                placeholder="Search for Products here"
             
              />
               
            </Box>
          </Box>
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            <IconButton component={Link} to="/wishlist" sx={{ color: "white" }}>
              <FaHeart  className="fs-8" />
            </IconButton>
            <IconButton component={Link} to="/cart" sx={{ color: "white" }}>
              <Badge badgeContent={cartState?.length || 0} color="info">
                <GiShoppingBag className="fs-8" />
              </Badge>
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Header Bottom */}
      <Box sx={{ py: 2, bgcolor: "background.paper" }} className="bottom">
        <Box >
          <Box display="flex" justifyContent="space-between" alignItems="center" className="bottomitem">
              <NavLink to="/" style={{ textDecoration: "none", color: "inherit" }}>Home</NavLink>
              <NavLink to="/product" style={{ textDecoration: "none", color: "inherit" }}>Our Store</NavLink>
              <NavLink to="/my-orders" style={{ textDecoration: "none", color: "inherit" }}>My Orders</NavLink>
              <IconButton component={Link} to={authState?.user === null ? "/login" : "/my-profile"}>
              <Typography variant="contained"  sx={{bgcolor:"#37474f",px:"13px",color:"white", borderRadius:"1px"}}>{authState?.user ? `${authState?.user?.email[0]}` : "Login"}</Typography>
            </IconButton>
              {authState?.user && (
                <Button onClick={handleLogout} variant="contained" color="error">
                  LogOut
                </Button>
              )}
            </Box>
        </Box>
      </Box>
    </>
  );
};

export default Header;
