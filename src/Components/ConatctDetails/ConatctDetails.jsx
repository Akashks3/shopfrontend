import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Button,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';

const ContactPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { shippingData } = location.state || {}; 
    const data = useSelector((store) => store.cart.cart);
    let total = 0;

    // Calculate total price
    for (let i = 0; i < data.length; i++) {
        total += data[i].price.sp * data[i].qty;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const submissionData = {
            shippingData,
            cartItems: data,
            total,
        };

        console.log('Submitting data:', submissionData);

        try {
            const response = await fetch('https://menshopbackend.onrender.com/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const result = await response.json();
            console.log('Order submission result:', result);

            if (response.ok) {
                
                navigate('/payment', { state: { submissionData } });
            } else {
                alert('Error submitting order. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('There was an error submitting your order. Please try again.');
        }
    };

    return (
        <Container maxWidth="md" className="ContactPage">
            <Typography variant="h4" gutterBottom>
                Contact Details
            </Typography>
            {shippingData && (
                <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                    <Typography variant="h6">Shipping Information</Typography>
                    <List>
                        <ListItem>
                            <ListItemText primary={`Name: ${shippingData.name}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Mobile: ${shippingData.mobile}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Pincode: ${shippingData.pincode}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Address: ${shippingData.address}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Locality: ${shippingData.locality}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`City: ${shippingData.city}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`State: ${shippingData.state}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`Place: ${shippingData.label}`} />
                        </ListItem>
                    </List>
                </Paper>
            )}
            <Typography variant="h6" gutterBottom>
                Your Cart Items
            </Typography>
            <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
                <List>
                    {data.map((item, index) => (
                        <div key={index}>
                            <ListItem>
                                <ListItemText primary={item.name} />
                                <ListItemText primary={`Price: ₹${item.price.sp}`} />
                                <ListItemText primary={`Quantity: ${item.qty}`} />
                                <ListItemText primary={`Total: ₹${item.qty * item.price.sp}`} />
                            </ListItem>
                            {index < data.length - 1 && <Divider />}
                        </div>
                    ))}
                </List>
            </Paper>
            <Typography variant="h6" gutterBottom>
                Subtotal: ₹{total}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Button variant="contained" color="primary" type="submit">
                    Submit Order
                </Button>
            </form>
        </Container>
    );
};

export default ContactPage;
