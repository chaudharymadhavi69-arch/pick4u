import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as apiRegister } from "../../api"; // from src/api/index.js

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer", // default
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) return "Valid email is required";
    if (!form.phone.match(/^\d{7,15}$/))
      return "Valid phone number is required";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      };

      const res = await apiRegister(payload); // expects { data: { success, message, user } }
      if (res?.data?.success) {
        setSuccessMsg(res.data.message || "Registered successfully");
        // optional: store token if returned; here register doesn't return token — redirect to login
        setTimeout(() => navigate("/login"), 800);
      } else {
        setError(res?.data?.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err?.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800 text-center">
          Create an account
        </h2>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Register to start using Pick4U
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 border border-red-100 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 text-green-700 border border-green-100 px-4 py-2 rounded mb-4">
            {successMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-sky-300"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-sky-300"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              type="tel"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:ring-2 focus:ring-sky-300"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                value={form.password}
                onChange={onChange}
                type={showPassword ? "text" : "password"}
                className="mt-1 block w-full rounded-md border-gray-200 shadow-sm pr-10 focus:ring-2 focus:ring-sky-300"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 px-2 py-1 rounded"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <div className="flex gap-3">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={form.role === "customer"}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-sm">Customer</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={form.role === "driver"}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-sm">Driver</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={onChange}
                  className="h-4 w-4"
                />
                <span className="text-sm">Admin</span>
              </label>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Choose role. If you register as driver, you'll need to complete
              KYC later.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-md font-medium disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <svg
                className="w-5 h-5 animate-spin mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-sky-600 hover:underline font-medium"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
