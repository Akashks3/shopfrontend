import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, Typography, IconButton, Select, MenuItem, FormControl, InputLabel, Slider } from "@mui/material";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import BreadCrumb from "../components/BreadCrumb";
import Meta from "../components/Meta";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../features/products/productSlilce";

const OurStore = () => {
  const [grid, setGrid] = useState(4);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [tag, setTag] = useState(null);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [sort, setSort] = useState(null);

  const productState = useSelector((state) => state?.product?.product);

  const dispatch = useDispatch();

  useEffect(() => {
    getProducts();
  }, [sort, tag, brand, category, minPrice, maxPrice]);

  useEffect(() => {
    let newBrands = [];
    let categoryList = [];
    let newTags = [];

    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      newBrands.push(element.brand);
      categoryList.push(element.category);
      newTags.push(element.tags);
    }

    setBrands(newBrands);
    setCategories(categoryList);
    setTags(newTags);
  }, [productState]);

  const getProducts = () => {
    dispatch(getAllProducts({ sort, tag, brand, category, minPrice, maxPrice }));
  };

  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <Container sx={{ py: 5 }} className="store-wrapper home-wrapper-2">
        <Grid container spacing={3}>
          {/* Left Sidebar - Filters */}
          <Grid item xs={12} md={3}>
            <Box sx={{ backgroundColor: "background.paper", padding: 2 }}>
              <Typography variant="h6" gutterBottom>Shop By Categories</Typography>
              <Box sx={{ marginBottom: 3 }}>
                <Typography variant="body1" onClick={() => setCategory(null)} sx={{ cursor: "pointer", color: "text.secondary" }}>All</Typography>
                {categories &&
                  [...new Set(categories)].map((item, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      sx={{ cursor: "pointer", color: "text.secondary" }}
                      onClick={() => setCategory(item)}
                    >
                      {item}
                    </Typography>
                  ))}
              </Box>

              <Typography variant="h6" gutterBottom>Filter By</Typography>
              {/* Price Filter */}
              <Typography variant="body1">Price</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>From</InputLabel>
                  <Select
                    value={minPrice || ""}
                    onChange={(e) => setMinPrice(e.target.value)}
                    label="From"
                  >
                    <MenuItem value={0}>0</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                    {/* Add more price ranges here */}
                  </Select>
                </FormControl>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>To</InputLabel>
                  <Select
                    value={maxPrice || ""}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    label="To"
                  >
                    <MenuItem value={500}>500</MenuItem>
                    <MenuItem value={1000}>1000</MenuItem>
                    <MenuItem value={5000}>5000</MenuItem>
                    {/* Add more price ranges here */}
                  </Select>
                </FormControl>
              </Box>

              {/* Tags Filter */}
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">Product Tags</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {tags &&
                    [...new Set(tags)].map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => setTag(item)}
                        sx={{ cursor: "pointer", padding: 1, border: "1px solid", borderRadius: 1 }}
                      >
                        {item}
                      </Box>
                    ))}
                </Box>
              </Box>

              {/* Brands Filter */}
              <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6">Product Brands</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {brands &&
                    [...new Set(brands)].map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => setBrand(item)}
                        sx={{ cursor: "pointer", padding: 1, border: "1px solid", borderRadius: 1 }}
                      >
                        {item}
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Products List */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ marginRight: 2 }}>Sort By:</Typography>
                <FormControl variant="outlined" sx={{ width: 200 }}>
                  <Select
                    value={sort || "title"}
                    onChange={(e) => setSort(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="title">Alphabetically, A-Z</MenuItem>
                    <MenuItem value="-title">Alphabetically, Z-A</MenuItem>
                    <MenuItem value="price">Price, low to high</MenuItem>
                    <MenuItem value="-price">Price, high to low</MenuItem>
                    <MenuItem value="createdAt">Date, old to new</MenuItem>
                    <MenuItem value="-createdAt">Date, new to old</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ marginRight: 2 }}>{productState?.length} Products</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton onClick={() => setGrid(3)}><img src="images/gr4.svg" alt="grid" /></IconButton>
                  <IconButton onClick={() => setGrid(4)}><img src="images/gr3.svg" alt="grid" /></IconButton>
                  <IconButton onClick={() => setGrid(6)}><img src="images/gr2.svg" alt="grid" /></IconButton>
                  <IconButton onClick={() => setGrid(12)}><img src="images/gr.svg" alt="grid" /></IconButton>
                </Box>
              </Box>
            </Box>

            <Grid container spacing={3}>
              <ProductCard data={productState ? productState : []} grid={grid} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default OurStore;
