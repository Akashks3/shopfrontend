import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TrendingProducts.css'
import { SyncLoader } from 'react-spinners';

export default function TrendingProducts() {
  const navigate = useNavigate();
  
  const [data, setData] = useState([]);
  const [randomId1, setRandomId1] = useState(0);
  const [randomId2, setRandomId2] = useState(0);
  const [randomId3, setRandomId3] = useState(0);
  const [randomId4, setRandomId4] = useState(0);
  const [randomId5, setRandomId5] = useState(0);
  const [randomId6, setRandomId6] = useState(0);
  const [randomId7, setRandomId7] = useState(0);
  const [randomId8, setRandomId8] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('https://menshopbackend.onrender.com/product').then((res) => {
      setData(res.data);
      setRandomId1(Math.floor(Math.random() * res.data.length));
      setRandomId2(Math.floor(Math.random() * res.data.length));
      setRandomId3(Math.floor(Math.random() * res.data.length));
      setRandomId4(Math.floor(Math.random() * res.data.length));
      setRandomId5(Math.floor(Math.random() * res.data.length));
      setRandomId6(Math.floor(Math.random() * res.data.length));
      setRandomId7(Math.floor(Math.random() * res.data.length));
      setRandomId8(Math.floor(Math.random() * res.data.length));

      setLoading(false);  
    });
  }, []);

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
      <div className="IndividualProd" onClick={() => { navigate(`/${product.tag}/${product._id}`); goToTop(); }}>
        <div className="IndividualProdImg">
          <img src={product.images[0]} alt={product.name} />
        </div>
        <div className="IndividualProdTitle">
          <p>{product.name}</p>
          <p>
            <span>₹ {product.price.sp}</span>
            <span>₹ {product.price.mrp}</span>
            <span><button id="buynow">Buy Now</button></span>
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="TrendingProducts">
      {loading ? (
        <div className="LoaderSinner">
          <SyncLoader />
        </div>
      ) : (
        <div className="TrendingProductsHeading">
          <div>Trendy jeans</div>
         
        </div>
      )}
      
      <div className="TrendingProdDisplay">
        {renderProduct(data[randomId1])}
        {renderProduct(data[randomId2])}
        {renderProduct(data[randomId3])}
        {renderProduct(data[randomId4])}
        </div>
       <div className="TrendingProdDisplay"> 
        {renderProduct(data[randomId5])}
        {renderProduct(data[randomId6])}
        {renderProduct(data[randomId7])}
        {renderProduct(data[randomId8])}
      </div>
    </div>
  );
}
