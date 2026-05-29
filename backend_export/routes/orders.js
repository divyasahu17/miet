const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/create-order', (req, res) => {

  const { userDetails, items, total, payment_method } = req.body;

  const query = `
    INSERT INTO orders 
    (first_name,last_name,email,phone,address,city,state,zip_code,country,total,payment_method,payment_status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.run(query, [
    userDetails.firstName,
    userDetails.lastName,
    userDetails.email,
    userDetails.phone,
    userDetails.address,
    userDetails.city,
    userDetails.state,
    userDetails.zipCode,
    userDetails.country,
    total,
    payment_method,
    'pending'
  ], function(err) {

    if (err) {
      return res.json({ success:false,error:err.message });
    }

    const orderId = this.lastID;

    items.forEach(item => {

      db.run(`
        INSERT INTO order_items 
        (order_id,product_id,product_name,price,quantity)
        VALUES (?,?,?,?,?)
      `,[
        orderId,
        item.id,
        item.title || item.name,
        item.price,
        item.quantity
      ]);

    });

    res.json({
      success:true,
      order_id:orderId
    });

  });

});




router.post('/payment-success',(req,res)=>{

  const {order_id, razorpay_payment_id} = req.body;

  db.run(`
    UPDATE orders 
    SET payment_status='paid',
    razorpay_payment_id=?
    WHERE id=?
  `,[razorpay_payment_id,order_id],function(err){

    if(err){
      return res.json({success:false});
    }

    res.json({success:true});

  });

});


module.exports = router;