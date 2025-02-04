import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import {
  Select,
  MenuItem,
  TextField,
  Slider,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import "./categorypage.css";

export default function CategoryPage() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [titleSearch, setTitleSearch] = useState("");

  useEffect(() => {
    axios.get("https://menshopbackend.onrender.com/product").then((res) => {
      setData(res.data);
      setCategories([...new Set(res.data.map((product) => product.category))]);
      setLoading(false);
      setFilteredData(res.data);
    });
  }, []);

  useEffect(() => {
    let filtered = data.filter(
      (product) =>
        product.price.sp >= minPrice &&
        product.price.sp <= maxPrice &&
        product.name.toLowerCase().includes(titleSearch.toLowerCase())
    );

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    setFilteredData(filtered);
  }, [data, selectedCategory, minPrice, maxPrice, titleSearch]);

  const goToTop = () => {
    window.scrollTo(0, 0);
  };

  const renderProduct = (product) => {
    if (!product) {
      return (
        <div className="IndividualProd">
          <div className="LoaderSinner">
            <SyncLoader />
          </div>
        </div>
      );
    }

    return (
      <div
        className="IndividualProd"
        key={product._id}
        onClick={() => {
          navigate(`/${product.tag}/${product._id}`);
          goToTop();
        }}
      >
        <div className="IndividualProdImg">
          <img src={product.images[0]} alt={product.name} />
        </div>
        <div className="IndividualProdTitle">
          <p>{product.name}</p>
          <p>
            <span>₹ {product.price.sp}</span>
            <span>₹ {product.price.mrp}</span>
            <span>
              <Button variant="contained" color="primary" id="buynow">
                Buy Now
              </Button>
            </span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="CategoryProducts">
      {loading ? (
        <div className="LoaderSinner">
          <SyncLoader />
        </div>
      ) : (
        <div className="CategoryProductsHeading">
          <p>Category</p>

          <Box sx={{ margin: "1rem 0" }} className="SelectCategoryBox">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              displayEmpty
              fullWidth
              sx={{ marginBottom: "1rem" }}
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ margin: "1rem 0" }}>
            <Slider
              value={[minPrice, maxPrice]}
              onChange={(_, newValue) => {
                setMinPrice(newValue[0]);
                setMaxPrice(newValue[1]);
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₹${value}`}
              min={0}
              max={10000}
              step={100}
              sx={{ width: "100%" }}
            />
          </Box>

          <div className="priceFilter">
            <TextField
              label="Min Price"
              variant="outlined"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              sx={{ width: "45%", marginRight: "1rem" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
            <TextField
              label="Max Price"
              variant="outlined"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              sx={{ width: "45%" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
          </div>

          <TextField
            label="Search by Title"
            variant="outlined"
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            fullWidth
            sx={{ marginTop: "1rem" }}
          />
        </div>
      )}

      <div className="CategoryProdDisplay">
        {filteredData.length === 0 ? (
          <p className="NoProductsFound">No products found</p>
        ) : (
          filteredData.map((product) => renderProduct(product))
        )}
      </div>
    </div>
  );
}
