export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "RIZA ECOMMERCE";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A MODERN FURNISHES FOR SALE PLATFORM";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
export const LATEST_PRODUCT_LIMIT =Number(process.env.LATEST_PRODUCT_LIMIT) || 4;
export const signInDefaultValues ={
    email :'',
    password: '',
};

export const signUpDefaultValues ={
    name:'',
    email :'',
    password: '',
    confirmPassword:''
};

export const shippingAddressDefaultValues ={
    fullName:'',
    streetAddress:'',
    phoneNumber:'',
    city:'',
    country:'',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.
PAYMENT_METHODS.split(', ') : ['PayPall', 'Card', 'CashOnWhenSeeProduct'];

export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || 'ChashOnWhenSeeProduct';