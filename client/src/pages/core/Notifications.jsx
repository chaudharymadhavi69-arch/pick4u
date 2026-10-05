import React from "react";
import { sendSms, sendEmail, sendPush } from "../../api";

export default function Notifications() {
  const handleSend = async (type) => {
    if (type === "sms")
      await sendSms({ to: "+911234567890", message: "Test SMS" });
    if (type === "email")
      await sendEmail({
        to: "test@example.com",
        subject: "Test",
        html: "<p>Hello</p>",
      });
    if (type === "push")
      await sendPush({ token: "user-fcm-token", title: "Test", body: "Hello" });

    alert(`${type} notification sent`);
  };

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Send Notifications</h2>
      <button
        onClick={() => handleSend("sms")}
        className="w-full py-2 bg-sky-600 text-white rounded"
      >
        Send SMS
      </button>
      <button
        onClick={() => handleSend("email")}
        className="w-full py-2 bg-emerald-600 text-white rounded"
      >
        Send Email
      </button>
      <button
        onClick={() => handleSend("push")}
        className="w-full py-2 bg-indigo-600 text-white rounded"
      >
        Send Push
      </button>
    </div>
  );
}
