import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Container from "../components/Container";
import BreadCrumb from "../components/BreadCrumb";
import { getOrders } from "../features/user/userSlice";
import {

  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,

} from "@mui/material";


const Orders = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const orderState = useSelector((state) => state?.auth?.getorderedProduct?.orders);

  
  const getTokenFromLocalStorage = useMemo(() => {
    const tokenData = localStorage.getItem("customer");
    return tokenData ? JSON.parse(tokenData) : null;
  }, []);

  const config2 = {
    headers: {
      Authorization: `Bearer ${getTokenFromLocalStorage?.token || ""}`,
      Accept: "application/json",
    },
  };

  useEffect(() => {
    if (getTokenFromLocalStorage) {
      dispatch(getOrders(config2)).finally(() => setLoading(false));
    } else {
      setLoading(false); 
    }
  }, [dispatch, getTokenFromLocalStorage]);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto", marginTop: "20px" }} />;
  }

  return (
    <>
      <BreadCrumb title="My Orders" />
      <Container class1="cart-wrapper home-wrapper-2 py-5">
        <TableContainer component={Paper} sx={{ marginTop: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Order Id</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Total Amount after Discount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Products</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderState?.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item?._id}</TableCell>
                  <TableCell>{item?.totalPrice}</TableCell>
                  <TableCell>{item?.totalPriceAfterDiscount}</TableCell>
                  <TableCell>{item?.orderStatus}</TableCell>
                  <TableCell>
                    <Box sx={{ backgroundColor: "#232f3e", padding: 2, borderRadius: 2 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell className="text-white">Product Name</TableCell>
                            <TableCell className="text-white">Quantity</TableCell>
                            <TableCell className="text-white">Price</TableCell>
                            <TableCell className="text-white">Color</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {item?.orderItems?.map((i) => (
                            <TableRow key={i?.product?.title}>
                              <TableCell className="text-white">{i?.product?.title}</TableCell>
                              <TableCell className="text-white">{i?.quantity}</TableCell>
                              <TableCell className="text-white">{i?.price}</TableCell>
                              <TableCell>
                                <Box sx={{ width: 20, height: 20, backgroundColor: i?.color?.title }} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Orders;
