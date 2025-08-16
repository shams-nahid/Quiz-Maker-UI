"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (userId && jwt) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user_id", data.user.user_id);
        localStorage.setItem("jwt_token", data.access_token);
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className='max-w-md mx-auto mt-16 p-8'>
      <h2 className='text-2xl font-bold mb-6'>Quiz Maker Login</h2>

      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Email:</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Password:</label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {error && <div className='text-red-600 text-sm'>{error}</div>}

        <Button onClick={handleLogin} disabled={loading} className='w-full'>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
