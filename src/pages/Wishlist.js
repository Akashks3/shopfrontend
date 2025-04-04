import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, Typography, IconButton, Card, CardContent, CardMedia } from '@mui/material';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import { addToWishlist } from "../features/products/productSlilce";
import { getuserProductWishlist } from "../features/user/userSlice";

const Wishlist = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getWishlistFromDb();
  }, []);

  const getWishlistFromDb = () => {
    dispatch(getuserProductWishlist());
  };

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const removeFromWishlist = (id) => {
    dispatch(addToWishlist(id));
    setTimeout(() => {
      dispatch(getuserProductWishlist());
    }, 300);
  };

  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />
      <Container sx={{ py: 5 }} className="wishlist-wrapper">
        <Grid container spacing={3}>
          {wishlistState && wishlistState.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h5" color="textSecondary" align="center">
                No Data
              </Typography>
            </Grid>
          )}

          {wishlistState &&
            wishlistState.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ position: 'relative', padding: 2 }}>
                    {/* Remove Icon */}
                    <IconButton
                      sx={{ position: 'absolute', top: 10, right: 10 }}
                      onClick={() => {
                        removeFromWishlist(item?._id);
                      }}
                    >
                      <AiOutlineCloseCircle size={24} color="red" />
                    </IconButton>

                    {/* Product Image */}
                    <CardMedia
                      component="img"
                      height="200"
                      image={item?.images[0]?.url ? item?.images[0]?.url : "images/watch.jpg"}
                      alt="Product Image"
                    />

                    {/* Product Title and Price */}
                    <CardContent>
                      <Typography variant="h6" component="div" noWrap>
                        {item?.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Rs. {item?.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Container>
    </>
  );
};

export default Wishlist;
