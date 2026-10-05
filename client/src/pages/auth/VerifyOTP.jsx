import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOTP } from "../../api/authApi";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    try {
      const res = await verifyOTP({ userId, otp });
      setMessage("OTP verified! You can now login.");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      // Redirect to login page after verification
      navigate("/auth/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div>
      <h2>Verify OTP</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="otp"
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Didn't receive OTP?{" "}
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={() => navigate("/auth/register")}
        >
          Resend / Register Again
        </span>
      </p>
    </div>
  );
};

export default VerifyOTP;
