import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogCard from "../components/BlogCard";

import SpecialProduct from "../components/SpecialProduct";
import Container from "../components/Container";

import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";
import { getAllProducts, addToWishlist } from "../features/products/productSlilce";
import ReactStars from "react-rating-stars-component";
import {  AiOutlineHeart } from "react-icons/ai";
import { Box, Grid, Typography, Button, Card, CardContent, CardMedia, IconButton } from "@mui/material";

const Home = () => {
  const blogState = useSelector((state) => state?.blog?.blog);
  const productState = useSelector((state) => state?.product?.product);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getblogs();
    getProducts();
  }, []);
  
  const getblogs = () => {
    dispatch(getAllBlogs());
  };

  const getProducts = () => {
    dispatch(getAllProducts());
  };

  const addToWish = (id) => {
    dispatch(addToWishlist(id));
  };

  return (
    <>
     
      <Container class1="featured-wrapper py-5 home-wrapper-2">
        <Typography variant="h5" align="center" gutterBottom>
          Recent Collection
        </Typography>
        <Grid container spacing={4}>
          {productState && productState.map((item, index) => {
            if (item.tags === "featured") {
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={item?.images[0]?.url}
                      alt="product"
                      height="250"
                      onClick={() => navigate(`/product/${item?._id}`)}
                    />
                    <CardContent>
                      <Typography variant="h6">{item?.brand}</Typography>
                      <Typography variant="body2" noWrap>{item?.title}</Typography>
                      <ReactStars
                        count={5}
                        size={24}
                        value={item?.totalrating.toString()}
                        edit={false}
                        activeColor="#ffd700"
                      />
                      <Typography variant="h5">Rs. {item?.price}</Typography>
                    </CardContent>
                    <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
                     
                    </Box>
                  </Card>
                </Grid>
              );
            }
          })}
        </Grid>
      </Container>


      <Container class1="blog-wrapper py-5 home-wrapper-2">
        <Typography variant="h5" align="center" gutterBottom>
          Our Latest Blogs
        </Typography>
        <Grid container spacing={4}>
          {blogState && blogState.map((item, index) => {
            if (index < 4) {
              return (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <BlogCard
                    id={item?._id}
                    title={item?.title}
                    description={item?.description}
                    image={item?.images[0]?.url}
                    date={moment(item?.createdAt).format("MMMM Do YYYY, h:mm a")}
                  />
                </Grid>
              );
            }
          })}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
