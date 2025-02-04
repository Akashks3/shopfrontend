import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegGrinHearts } from 'react-icons/fa';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { SlBag } from 'react-icons/sl';
import Avatar from '@mui/material/Avatar';
import { logout } from '../../Redux/LoginUserData/Action';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    background: 'hwb(180 12% 87%)',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login');
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const cart = useSelector((store) => store.cart.cart);
  const wishlist = useSelector((store) => store.cart.wishlist);
  const userLogData = useSelector((store) => store.loginUserData.userData);
  const isAuth = useSelector((store) => store.loginUserData.isAuthenticate);
  console.log('home nav ', userLogData);

  return (
    <div>
      <div className="NavBarMain">
        <div onClick={() => navigate('/')}>M</div>
        <div onClick={() => navigate('/cart')}>
          <IconButton aria-label="wishlist">
            <StyledBadge badgeContent={wishlist.length} color="secondary">
              <FaRegGrinHearts />
            </StyledBadge>
          </IconButton>
          <IconButton aria-label="cart">
            <StyledBadge badgeContent={cart.length} color="secondary">
              <SlBag />
            </StyledBadge>
          </IconButton>
        </div>
      </div>
      <div className="NavBarBottom">
        <div onClick={() => navigate('/')} id="home1">
          Home
        </div>
        <div onClick={() => navigate('/category/men-jeans/products')} id="home1">
          Categories
        </div>
        <div className="navbar">
          {isAuth ? (
            <div className="NavbarAvtar dropdown" onClick={toggleDropdown}>
              <div className="name">
                <p>{userLogData[0].user.email[0]}</p>
              </div>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button className="dropdown-item">
                    Hello, {userLogData[0].user.email}
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="dropdown">
              <button
                className="dropdown-item"
                onClick={handleLogin}
                aria-label="Login"
              >
                <div className="name">
                  <Avatar src="https://th.bing.com/th/id/OIP.z8-GqzZcw5PZgZkcGisFOAAAAA?w=166&h=180&c=7&r=0&o=5&dpr=1.25&pid=1.7" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
