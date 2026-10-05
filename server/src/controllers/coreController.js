// core.controller.js
import axios from "axios";
import twilio from "twilio";
import nodemailer from "nodemailer";
import admin from "firebase-admin";
import Razorpay from "razorpay";
import { calculateFareWithConfig } from "../helpers/fare.helper.js";

// Distance
export const getDistance = async (req, res) => {
  try {
    const { pickupAddress, dropAddress } = req.body;
    if (!pickupAddress || !dropAddress) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const apiKey = process.env.GMAPS_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      pickupAddress
    )}&destinations=${encodeURIComponent(dropAddress)}&key=${apiKey}`;

    let distanceKm = 10;
    try {
      const response = await axios.get(url);
      distanceKm = response.data.rows[0].elements[0].distance.value / 1000;
    } catch {
      console.warn("Google Maps API failed, fallback 10km");
    }

    res.json({ success: true, distance: distanceKm });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating distance", error: error.message });
  }
};

// Fare
export const getFare = async (req, res) => {
  try {
    const { distance, weight, deliveryType } = req.body;
    const fare = await calculateFareWithConfig(distance, weight, deliveryType);
    res.json({ success: true, fare });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating fare", error: error.message });
  }
};

// SMS
export const sendSms = async (req, res) => {
  try {
    const { to, message } = req.body;
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to,
    });
    res.json({ success: true, message: "SMS sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending SMS", error: error.message });
  }
};

// Email
export const sendEmail = async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });
    res.json({ success: true, message: "Email sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending email", error: error.message });
  }
};

// Push
export const sendPush = async (req, res) => {
  try {
    const { token, title, body } = req.body;
    await admin.messaging().send({ notification: { title, body }, token });
    res.json({ success: true, message: "Push notification sent" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending push", error: error.message });
  }
};

// Refund
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount ? amount * 100 : undefined,
    });
    res.json({ success: true, message: "Refund processed", refund });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing refund", error: error.message });
  }
};
