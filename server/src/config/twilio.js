import Twilio from "twilio";

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTP = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your Pick4U verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone, // must be in +91XXXXXXXXXX format
    });
    return message;
  } catch (error) {
    console.error("Twilio Error:", error); // 👈 Console me pura error
    throw new Error(error.message); // 👈 Postman response me actual Twilio ka message
  }
};
