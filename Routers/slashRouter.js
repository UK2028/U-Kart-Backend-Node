const getProductsController = require('../Controllers/getProducts');
const getFeaturedProductsController = require('../Controllers/getFeaturedProducts');
const getProductDetailController = require('../Controllers/getProductdetail');
const getFilteredProductsController = require('../Controllers/getFilteredProducts');
const registerController = require('../Controllers/Register');
const loginController = require('../Controllers/Login');
const refreshController = require('../Controllers/getRefreshToken');
const getUserController = require('../Controllers/GetUser');
const CheckTokenMiddleware = require('../Middleware/CheckToken');
const updateUserCartController = require('../Controllers/UpdateUserCartList');
const logoutController = require('../Controllers/Logout');
const transactionController = require('../Controllers/Transaction');
const getOrdersListController = require('../Controllers/getOrdersList');

const express = require('express');

const routers = express.Router();

routers.get('/products', getProductsController.getProducts);
routers.get('/features',getFeaturedProductsController.getFeaturedProducts);
routers.get('/products/:id',getProductDetailController.getProductdetail);
routers.post('/products/filter',getFilteredProductsController.getFilteredProducts);
routers.post('/register', registerController.registerUser);
routers.post('/login', loginController.loginUser);
routers.post('/refresh', refreshController.getRefreshToken);
routers.get('/auth',CheckTokenMiddleware.checkToken,getUserController.getUser);
routers.post('/add_to_cart',CheckTokenMiddleware.checkToken,updateUserCartController.addToUserCartList);
routers.post('/remove_from_cart',CheckTokenMiddleware.checkToken,updateUserCartController.removeFromUserCartList);
routers.get('/logout',logoutController.logoutUser);

routers.post('/order',transactionController.createOrder);
routers.post('/verify_payment',transactionController.paymentVerification);

routers.post('/order_list',getOrdersListController.createOrderList);

module.exports = routers;