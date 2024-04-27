import express from "express";
const router = express.Router();
import Stripe from "stripe";
import dotenv from 'dotenv';
import orderModel from "../models/orderModel.js";
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/webhook",express.raw({ type: "application/json" }), async (req, res) => {
    const payload = req.body;
    const endpointSecret = "whsec_d65875ceacd83fd6e0c35f417601075014d8f16a2f06d5f48e2ecff2d8c372c2";
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {

      const session = event.data.object;
      const sessionId = session.id;
      const customerDetails = session.customer_details;

      await stripe.checkout.sessions.listLineItems(sessionId, async(err, lineItems) => {
        if (err) {
          console.error(err);
        } else {
          const items = lineItems.data;
          const existingOrder = await orderModel.findOne({ payment_id: session.payment_intent });
        
          if(!existingOrder){
                const order = new orderModel({
                   payment_id : session.payment_intent,
                   amount : session.amount_total,
                   email  : customerDetails.email,
                   userName :   customerDetails.name,
                   address : {
                        ...customerDetails.address
                   },
                    items : {
                       ...items
                    }
      
                });
              order.save();
          }
        }
      });

    }

    res.send();
  }
);

export default router;
