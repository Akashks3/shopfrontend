import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
} from '@mui/material';

const ShippingAddressPage = () => {
    const navigate = useNavigate();
    const [shippingData, setShippingData] = useState({
        name: '',
        mobile: '',
        pincode: '',
        address: '',
        locality: '',
        city: '',
        state: '',
        label: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/contact', { state: { shippingData } });
    };

    return (
        <Container maxWidth="sm" className="ShippingAddressPage">
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Typography variant="h4" gutterBottom>
                    Shipping Address
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="name"
                                label="Name"
                                value={shippingData.name}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="mobile"
                                label="Mobile"
                                value={shippingData.mobile}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="pincode"
                                label="Pincode"
                                value={shippingData.pincode}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="address"
                                label="Address"
                                value={shippingData.address}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="locality"
                                label="Locality"
                                value={shippingData.locality}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="city"
                                label="City"
                                value={shippingData.city}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="state"
                                label="State"
                                value={shippingData.state}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                name="label"
                                label="Place"
                                value={shippingData.label}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                fullWidth
                            >
                                Continue to Contact
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default ShippingAddressPage;