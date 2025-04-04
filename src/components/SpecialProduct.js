import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography, Button, Box, LinearProgress } from "@mui/material";

const SpecialProduct = (props) => {
  const { title, brand, totalrating, price, sold, quantity, id, img } = props;

  console.log(id);

  // Calculate the progress percentage
  const progress = (sold / (quantity + sold)) * 100;

  return (
    <div className="col-4 mb-3">
      <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Product Image */}
        <CardMedia
          component="img"
          height="300"
          image={img}
          alt={title}
          sx={{ objectFit: 'contain' }}
        />

        {/* Product Content */}
        <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Box>
            {/* Product Brand and Title */}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {brand}
            </Typography>
            <Typography variant="h6" gutterBottom>
              {title?.length > 20 ? title?.substr(0, 20) + "..." : title}
            </Typography>

            {/* Product Rating */}
            <ReactStars
              count={5}
              size={24}
              value={totalrating}
              edit={false}
              activeColor="#ffd700"
            />

            {/* Price */}
            <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            ₹{price}
            </Typography>
          </Box>

          {/* Product Quantity and Progress */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Products: {quantity}</Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ my: 1 }}
              color="secondary"
            />
          </Box>

          {/* View Product Button */}
          <Box sx={{ mt: 'auto' }}>
            <Button 
              component={Link} 
              to={`/product/${id}`} 
              variant="contained" 
              color="primary" 
              fullWidth>
              View
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpecialProduct;
