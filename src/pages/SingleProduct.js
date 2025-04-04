import React, { useEffect, useState } from "react"; 
import ReactStars from "react-rating-stars-component";
import { Container, Typography, Box, Button, TextField, Grid, Divider, IconButton } from '@mui/material';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ReactImageZoom from "react-image-zoom";
import { addProdToCart, getUserCart } from "../features/user/userSlice";
import { getAProduct, getAllProducts, addRating } from "../features/products/productSlilce";
import Color from "../components/Color";
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";

const SingleProduct = () => {
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alreadyAdded, setAlreadyAdded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const getProductId = location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.singleproduct);
  const productsState = useSelector((state) => state?.product?.product);
  const cartState = useSelector((state) => state?.auth?.cartProducts);
  const rat = productState?.totalrating;
  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  useEffect(() => {
    dispatch(getAProduct(getProductId));
    dispatch(getUserCart());
    dispatch(getAllProducts());
  }, [dispatch, getProductId]);

  useEffect(() => {
    for (let index = 0; index < cartState?.length; index++) {
      if (getProductId === cartState[index]?.productId?._id) {
        setAlreadyAdded(true);
      }
    }
  }, [cartState, getProductId]);

  const uploadCart = () => {
    if (color === null) {
      toast.error("Please choose Color");
    } else {
      dispatch(
        addProdToCart({
          productId: productState?._id,
          quantity,
          color,
          price: productState?.price,
        }),
        navigate("/cart")
      );
    }
  };

  const props = {
    width: 594,
    height: 600,
    zoomWidth: 600,
    img: productState?.images[0].url
      ? productState?.images[0].url
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgv5gD-RdEsJ4WWt-FzFqDNBT27gQXiflRJA&s",
  };

  const [star, setStar] = useState(null);
  const [comment, setComment] = useState(null);
  const [isFilled, setIsFilled] = useState(false);

  const handleToggle = () => {
    setIsFilled(!isFilled);
  };

  const addRatingToProduct = () => {
    if (star === null) {
      toast.error("Please add star rating");
      return false;
    } else if (comment === null) {
      toast.error("Please Write Review About the Product");
      return false;
    } else {
      dispatch(addRating({ star: star, comment: comment, prodId: getProductId }));
      setTimeout(() => {
        dispatch(getAProduct(getProductId));
      }, 100);
    }
    return false;
  };

  const [popularProduct, setPopularProduct] = useState([]);
  useEffect(() => {
    let data = [];
    for (let index = 0; index < productsState.length; index++) {
      const element = productsState[index];
      if (element.tags === "popular") {
        data.push(element);
      }
    }
    setPopularProduct(data);
  }, [productsState]);

  return (
    <>
      <Meta title={"Product Name"} />
      <BreadCrumb title={productState?.title} />
      <Container sx={{ py: 5 }} className="main-product-wrapper">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box className="main-product-image">
              <ReactImageZoom {...props} />
            </Box>
            <Box className="other-product-images" sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {productState?.images.map((item, index) => (
                <Box key={index}>
                  <img src={item?.url} className="img-fluid" alt="" />
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box className="main-product-details">
              <Typography variant="h3">{productState?.title}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h5">Rs. {productState?.price}/-</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2 }}>
                <ReactStars
                  count={5}
                  size={24}
                  value={productState?.totalrating}
                  edit={false}
                  activeColor="#ffd700"
                />
                <Typography variant="body2">
                  ({productState?.ratings?.length} Reviews)
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1">Type: {productState?.category}</Typography>
                <Typography variant="body1">Brand: {productState?.brand}</Typography>
                <Typography variant="body1">Category: {productState?.category}</Typography>
                <Typography variant="body1">Tags: {productState?.tags}</Typography>
                <Typography variant="body1">Availability: In Stock</Typography>
              </Box>
              {!alreadyAdded && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6">Color:</Typography>
                  <Color setColor={setColor} colorData={productState?.color} />
                </Box>
              )}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6">Quantity:</Typography>
                {!alreadyAdded && (
                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    inputProps={{ min: 1, max: 10 }}
                    sx={{ width: 70, ml: 2 }}
                  />
                )}
                <Box sx={{ ml: 3 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      alreadyAdded ? navigate("/cart") : uploadCart();
                    }}
                  >
                    {alreadyAdded ? "Go to Cart" : "Add to Cart"}
                  </Button>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handleToggle}>
                  {isFilled ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
                </IconButton>
              </Box>
              <Typography variant="body1" sx={{ mt: 3 }}>
                Free shipping and returns available on all orders!
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ py: 5 }} className="description-wrapper">
        <Typography variant="h4" gutterBottom>Description</Typography>
        <Box className="bg-white p-3">
          <Typography variant="body1" dangerouslySetInnerHTML={{ __html: productState?.description }} />
        </Box>
      </Container>
      <Container sx={{ py: 5 }} className="reviews-wrapper">
        <Typography variant="h3" gutterBottom>Reviews</Typography>
        <Box className="review-inner-wrapper">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Box>
              <Typography variant="h4" gutterBottom>Customer Reviews</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ReactStars
                  count={5}
                  size={24}
                  value={productState?.totalrating}
                  edit={false}
                  activeColor="#ffd700"
                />
                <Typography variant="body2">
                  Based on {productState?.ratings?.length} Reviews
                </Typography>
              </Box>
            </Box>
            <Box>
              <Button variant="text" color="primary">Write a Review</Button>
            </Box>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h4">Write a Review</Typography>
            <Box sx={{ my: 2 }}>
              <ReactStars
                count={5}
                size={24}
                value={star}
                edit={true}
                activeColor="#ffd700"
                onChange={setStar}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Comments"
              onChange={(e) => setComment(e.target.value)}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" onClick={addRatingToProduct}>Submit Review</Button>
            </Box>
          </Box>
          <Box sx={{ mt: 4 }}>
            {productState?.ratings?.map((item, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>User</Typography>
                <ReactStars
                  count={5}
                  size={24}
                  value={item?.star}
                  edit={false}
                  activeColor="#ffd700"
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {item?.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
      <Container sx={{ py: 5 }} className="popular-wrapper">
        <Typography variant="h3" gutterBottom>Our Popular Products</Typography>
        <Grid container spacing={3}>
          <ProductCard data={popularProduct} />
        </Grid>
      </Container>
    </>
  );
};

export default SingleProduct;
