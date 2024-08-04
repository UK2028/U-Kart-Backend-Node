const Transaction = require('../Models/TransactionModel');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const crypto = require('crypto');

const instance = new Razorpay({ key_id: 'rzp_test_j4utDJIZNOsvz6', key_secret: 'CKhrbawLXOExlb1B1BTuKali' })

exports.createOrder = async (req,res) => {

    const { amount, name, email } = req.body;

    const orderOptions = {
        amount: Number(amount)*100,
        currency: 'INR',
        receipt: shortid.generate(),
        notes: {
            name,
            email
        }
    };

    try {

        const order = await instance.orders.create(orderOptions);

        return res.status(200).json({
            message: "Order created",
            success: true,
            order
        })
        
    } catch (error) {
        res.status(400).json({
            message: "Order not created",
            success: false
        })
    }
}

exports.paymentVerification = async (req,res) => {

    try
    {    
        const { paymentId, orderId, amount } = req.body;

        const razorpay_signature = req.headers["x-razorpay-signature"];

        var hmac = crypto.createHmac('sha256', 'CKhrbawLXOExlb1B1BTuKali');

        hmac.update(orderId + "|" + paymentId);
        
        const generated_signature = hmac.digest('hex');
        
        if (generated_signature === razorpay_signature) {
            
            const verifiedTransaction = await Transaction.create({
                order_id: orderId,
                payment_id: paymentId,
                amount
            });

            return res.status(200).json({
                message: "payment successfully verified",
                verify: true,
                details: verifiedTransaction
            });

        }
    }
    catch (error) {
        return res.status(400).json({
            message: "payment not verified",
            verify: false
        });
    }
}
