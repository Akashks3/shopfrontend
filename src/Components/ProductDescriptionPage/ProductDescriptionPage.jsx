import axios from 'axios'; 
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addCart, addWishlist } from '../../Redux/Cart/Action';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SyncLoader } from 'react-spinners';
import './ProductDescriptionPage.css';

export default function ProductDescriptionPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        let isMounted = true;
        if (id) {
            axios.get(`https://menshopbackend.onrender.com/product/id/${id}`)
                .then((res) => {
                    if (isMounted) {
                        setData(res.data);
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching product data', err);
                    setIsLoading(false);
                });
        }
        return () => {
            isMounted = false;
        };
    }, [id]);

    const handleAddBag = () => {
        dispatch(addCart(data));
        toast.success('Product Added To Cart Successfully');
    };

    const handleAddWishlist = () => {
        dispatch(addWishlist(data));
        toast.success('Product Added To Wishlist Successfully');
    };

    return (
        <div>
            {isLoading ? (
                <div className="ProdDetails">
                    <div className="SyncLoaderInd">
                        <SyncLoader />
                    </div>
                </div>
            ) : data ? (
                <div className="ProdDetails">
                    <div className="ProdImages">
                        <img 
                            src={data.images && data.images.length > 0 ? data.images[0] : 'default-image.jpg'} 
                            alt="Product" 
                        />
                    </div>

                    <div className="ProdInfo">
                        <div className="PorductDetailDiv">
                            <p>PRODUCT DETAILS</p>
                        </div>

                        <div><p>{data.name}</p></div>
                        <div id="brand">
                            Brand :- <span>{data.brand_name}</span>
                        </div>
                        <div id="brand"><span>{data.product_details[0]}</span></div>

                        <div className="SelectSizeDiv" id="size">
                            <span>Select Size :- </span>
                            <div className="SizesDiv">
                                {data.sizes.map((size, index) => (
                                    <div key={index}><p>{size}</p></div>
                                ))}
                            </div>
                        </div>

                        <div id="rating">
                            Rating:- <span>{data.customer_rating} <span className="fa fa-star checked"></span></span>
                        </div>

                        <div className="PriceDiv" id="price">
                            <div><p>Rs. {data.price.sp}</p></div>
                            <div><p>Rs. {data.price.mrp}</p></div>
                            <div><p>({data.price.discount}% OFF)</p></div>
                        </div>

                        <div className="AddButton">
                            <button onClick={handleAddBag}>ADD TO CART</button>
                            <button onClick={handleAddWishlist}>WISHLIST</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="ProdDetails">
                    <p>Product not found.</p>
                </div>
            )}
            <ToastContainer />
        </div>
    );
}
