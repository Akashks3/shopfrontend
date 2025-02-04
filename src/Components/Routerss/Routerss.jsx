import LandingPage from "../LandingPage/LandingPage";
import { Route, Routes } from "react-router-dom";
import Login from "../Login/Login";
import Register from "../Register/Register";
import CartPage from "../CartPage/CartPage";
import ProductDescriptionPage from "../ProductDescriptionPage/ProductDescriptionPage";
import CategoryPage from "../CategoryPage/CategoryPage";
import TrendingProducts from "../TrendingProducts/TrendingProducts";
import ConatctDetails from "../ConatctDetails/ConatctDetails";
import PaymentPage from "../PaymentPage/PaymentPage";
import OrderPage from "../PaymentPage/Orderpage";
import ShippingAddressPage from "../ConatctDetails/address";

export default function Routerss() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <LandingPage />
              <TrendingProducts />
            </>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<CartPage />} />

        <Route path="/men-jeans/:id" element={<ProductDescriptionPage />} />

        <Route path="/men-t-shirts/:id" element={<ProductDescriptionPage />} />

        <Route path="/category/:id/products" element={<CategoryPage />} />

        <Route path="/shipping" element={<ShippingAddressPage />} />

        <Route path="/contact" element={<ConatctDetails />} />

        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </div>
  );
}
