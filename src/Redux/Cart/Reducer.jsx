import { DATA_LOADING, DATA_SUCCESS, DATA_FAILURE, ADD_CART, REMOVE_ONE_CART, EMPTY_CART, ADD_WISHLIST, DELETE_ITEM_CART } from "./Action";

const initState = {
    loading: false,
    error: false,
    data: [],
    cart: [],
    wishlist: []
};

export const cartReducer = (store = initState, { type, payload }) => {

    switch (type) {
        case DATA_LOADING:
            return { ...store, loading: true };

        case DATA_SUCCESS:
            return { ...store, loading: false, todos: [...payload], error: false };

        case DATA_FAILURE:
            return { ...store, loading: false, error: true, todos: [] };

        case ADD_CART:
            console.log("product", store.cart)

            const AfterAdding = store.cart.find(x => x._id === payload._id)
            console.log("exist", AfterAdding)
            if (AfterAdding) {
                console.log("inside add", payload._id)
                var notFound = (store.cart.map((x) => x._id === payload._id ? { ...AfterAdding, qty: AfterAdding.qty + 1 } : x))
                return { ...store, cart: notFound };
            } else {
                return { ...store, cart: [...store.cart, { ...payload, qty: 1 }] }
            }

        case REMOVE_ONE_CART:
            console.log("product111", store.cart)
            const AfterRemove = store.cart.find(x => x._id === payload._id)
            console.log("exist", AfterRemove)
            if (AfterRemove.qty === 1) {
            
                const updatedCart = store.cart.filter((x) => x._id !== payload._id);
                console.log("one")
                return { ...store, cart: updatedCart };
            } else {
                
                const updatedCart = store.cart.map(x => x._id === payload._id ? { ...AfterRemove, qty: AfterRemove.qty - 1 } : x)
                console.log("many", updatedCart)
                return { ...store, cart: updatedCart }
            }

        case EMPTY_CART:
            return { ...store, cart: [] };

        case DELETE_ITEM_CART:
            const AfterDeleteCart = store.cart.filter((el) => el.id !== payload)
            return { ...store, cart: AfterDeleteCart };

        case ADD_WISHLIST:
            return { ...store, wishlist: [...store.wishlist, payload] };

        default:
            return store;
    }
}
