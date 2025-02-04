import React from 'react';
import { useSelector } from 'react-redux';
import {
    Container,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';

const OrderPage = () => {
    const data = useSelector((store) => store.cart.cart);

 

    return (
        <Container maxWidth="md" className="ContactPage">
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
           
            
        </Container>
    );
};

export default OrderPage;
