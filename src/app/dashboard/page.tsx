"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (!userId || !jwt) {
      router.push("/");
      return;
    }

    setUser({ user_id: userId });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("jwt_token");
    router.push("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='max-w-2xl mx-auto mt-16 p-8'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>Dashboard</h2>
        <Button onClick={handleLogout} variant='secondary'>
          Logout
        </Button>
      </div>

      <div className='space-y-4'>
        <Button
          onClick={() => router.push("/upload")}
          className='w-full p-6 text-lg'
        >
          Upload New PDF
        </Button>

        <Button
          onClick={() => router.push("/pdfs")}
          className='w-full p-6 text-lg'
          variant='secondary'
        >
          View My PDFs
        </Button>
      </div>
    </div>
  );
}
