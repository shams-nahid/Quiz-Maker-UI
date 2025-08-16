"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [language, setLanguage] = useState("english");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (!userId || !jwt) {
      router.push("/");
      return;
    }
  }, [router]);

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", localStorage.getItem("user_id") || "");
      formData.append("num_questions", numQuestions.toString());
      formData.append("languages", language);

      const response = await fetch("http://localhost:8000/generate-quiz-json", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("quiz_data", JSON.stringify(data));
        router.push("/quiz");
      } else {
        setError("Upload failed. Please try again.");
      }
    } catch (err) {
      setError("Upload error. Please try again.");
    }

    setUploading(false);
  };

  return (
    <div className='max-w-2xl mx-auto mt-16 p-8'>
      <Button onClick={() => router.push("/dashboard")} className='mb-6'>
        Back to Dashboard
      </Button>

      <h2 className='text-2xl font-bold mb-6'>Upload PDF</h2>

      <div className='space-y-6'>
        <div>
          <label className='block text-sm font-medium mb-2'>
            Select PDF File:
          </label>
          <input
            type='file'
            accept='.pdf'
            onChange={e => setFile(e.target.files?.[0] || null)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
          />
          {file && (
            <p className='text-sm text-gray-600 mt-1'>
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>
            Number of Questions:
          </label>
          <select
            value={numQuestions}
            onChange={e => setNumQuestions(parseInt(e.target.value))}
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Language:</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md'
          >
            <option value='english'>English</option>
            <option value='spanish'>Spanish</option>
          </select>
        </div>

        {error && <div className='text-red-600 text-sm'>{error}</div>}

        <Button
          onClick={handleUpload}
          disabled={uploading || !file}
          className='w-full p-4 text-lg'
        >
          {uploading ? "Generating Quiz..." : "Generate Quiz"}
        </Button>

        {uploading && (
          <div className='text-center text-gray-600'>
            This may take a few moments...
          </div>
        )}
      </div>
    </div>
  );
}
