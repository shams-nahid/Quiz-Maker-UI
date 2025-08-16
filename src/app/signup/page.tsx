"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { API_BASE_URL } from "./../../config";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (userId && jwt) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Account created successfully! You can now login.");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.message || "Sign up failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className='max-w-md mx-auto mt-16 p-8'>
      <div className='mb-6'>
        <button
          onClick={() => router.push("/")}
          className='text-blue-600 hover:text-blue-800 text-sm mb-4'
        >
          ← Back to Login
        </button>
        <h2 className='text-2xl font-bold'>Create Account</h2>
        <p className='text-gray-600 mt-2'>
          Sign up to start generating quizzes from your PDFs
        </p>
      </div>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Full Name:</label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Enter your full name'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Email:</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter your email address'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Password:</label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='Enter your password (min 6 characters)'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>
            Confirm Password:
          </label>
          <input
            type='password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder='Confirm your password'
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {error && (
          <div className='text-red-600 text-sm bg-red-50 p-3 rounded'>
            {error}
          </div>
        )}

        {success && (
          <div className='text-green-600 text-sm bg-green-50 p-3 rounded'>
            {success}
          </div>
        )}

        <Button onClick={handleSignUp} disabled={loading} className='w-full'>
          {loading ? "Creating Account..." : "Create Account"}
        </Button>

        <div className='text-center mt-4'>
          <span className='text-sm text-gray-600'>
            Already have an account?{" "}
          </span>
          <button
            onClick={() => router.push("/")}
            className='text-sm text-blue-600 hover:text-blue-800 underline'
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
}
