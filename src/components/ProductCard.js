import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../features/products/productSlilce";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Card, CardMedia, CardContent, Typography, IconButton, Box } from "@mui/material";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const { grid, data } = props;
  const dispatch = useDispatch();
  const location = useLocation();

  const wishlistState = useSelector((state) => state?.auth?.wishlist?.wishlist);

  const [wishlist, setWishlist] = useState(wishlistState || []);

  useEffect(() => {
    setWishlist(wishlistState || []);
  }, [wishlistState]);

  const isProductInWishlist = (productId) => {
    return wishlist?.some((item) => item._id === productId);
  };

  const addToWish = (productId) => {
    if (isProductInWishlist(productId)) {
      dispatch(addToWishlist(productId));
      const updatedWishlist = wishlist.filter((item) => item._id !== productId);
      setWishlist(updatedWishlist);
    } else {
      dispatch(addToWishlist(productId));
      const product = data.find((item) => item._id === productId);
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <>
      {data?.map((item, index) => {
        const isWishlist = isProductInWishlist(item._id);
        return (
          <div
            key={index}
            className={`${
              location.pathname == "/product" ? `gr-${grid}` : "col-3"
            } `}
          >
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <Box sx={{ position: "relative" }}>
                {/* Wishlist Icon */}
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "#607d8b",
                    borderRadius: "50%",
                    padding: 1,
                  }}
                  onClick={() => addToWish(item?._id)}
                >
                  {isWishlist ? (
                    <AiFillHeart className="fs-5" />
                  ) : (
                    <AiOutlineHeart className="fs-5" />
                  )}
                </IconButton>

                {/* Product Image */}
                <CardMedia
                  component="img"
                  image={item?.images[0]?.url}
                  alt="product image"
                  height="250"
                  onClick={() => navigate("/product/" + item?._id)}
                  sx={{ cursor: "pointer", objectFit: "contain" }}
                />
              </Box>

              {/* Product Content */}
              <CardContent sx={{ padding: 2 }}>
                {/* Brand and Title */}
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {item?.brand}
                </Typography>
                <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                  {grid === 12 || grid === 6
                    ? item?.title
                    : item?.title?.substr(0, 80) + "..."}
                </Typography>

                {/* Product Rating */}
                <ReactStars
                  count={5}
                  size={24}
                  value={item?.totalrating}
                  edit={false}
                  activeColor="#ffd700"
                />

                <Typography variant="body1" color="gray" sx={{ mt: 1 }}>
                ₹ {item?.price}
                </Typography>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </>
  );
};

export default ProductCard;
