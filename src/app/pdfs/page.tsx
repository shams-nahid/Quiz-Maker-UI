"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function PDFs() {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (!userId || !jwt) {
      router.push("/");
      return;
    }

    fetchPdfs(userId);
  }, [router]);

  const fetchPdfs = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/user-pdfs/${userId}`);
      const data = await response.json();

      if (data.success) {
        setPdfs(data.pdfs);
      } else {
        setError("Failed to load PDFs");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    } catch {
      return "Unknown date";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "ready":
        return "text-green-600 bg-green-50 border-green-200";
      case "processing":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "failed":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto mt-16 p-8'>
        <Button onClick={() => router.push("/dashboard")} className='mb-6'>
          Back to Dashboard
        </Button>
        <div className='text-center py-8'>
          <div>Loading your PDFs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto mt-16 p-8'>
      <div className='mb-6'>
        <Button onClick={() => router.push("/dashboard")} className='mb-4'>
          Back to Dashboard
        </Button>

        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold'>My PDFs</h2>
          <Button onClick={() => router.push("/upload")}>Upload New PDF</Button>
        </div>

        {pdfs.length > 0 && (
          <p className='text-gray-600 mt-2'>
            {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""} uploaded
          </p>
        )}
      </div>

      {error && (
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
          {error}
        </div>
      )}

      {pdfs.length === 0 ? (
        <div className='text-center py-12 bg-gray-50 rounded-lg'>
          <div className='text-gray-500 mb-4'>
            <svg
              className='mx-auto h-12 w-12 mb-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
              />
            </svg>
            <h3 className='text-lg font-medium text-gray-900'>
              No PDFs uploaded yet
            </h3>
            <p className='text-gray-500 mt-2'>
              Upload your first PDF to get started with quiz generation
            </p>
          </div>
          <Button onClick={() => router.push("/upload")}>
            Upload Your First PDF
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {pdfs.map(pdf => (
            <div
              key={pdf.pdf_id}
              className='border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer'
              onClick={() => router.push(`/pdfs/${pdf.pdf_id}`)}
            >
              <div className='flex justify-between items-start'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-3 mb-2'>
                    <h3 className='text-lg font-semibold text-gray-900 hover:text-blue-600'>
                      {pdf.original_name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(
                        pdf.status
                      )}`}
                    >
                      {pdf.status || "Unknown"}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600'>
                    <div>
                      <span className='font-medium'>File Size:</span>
                      <br />
                      {formatFileSize(pdf.file_size)}
                    </div>
                    <div>
                      <span className='font-medium'>Uploaded:</span>
                      <br />
                      {formatDate(pdf.uploaded_at)}
                    </div>
                    <div>
                      <span className='font-medium'>PDF ID:</span>
                      <br />
                      <span className='font-mono text-xs'>{pdf.pdf_id}</span>
                    </div>
                  </div>

                  <div className='mt-3 text-sm text-blue-600'>
                    Click to view quiz history →
                  </div>
                </div>

                <div className='ml-4'>
                  <div className='text-right'>
                    <svg
                      className='h-8 w-8 text-red-500'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pdfs.length > 0 && (
        <div className='mt-8 text-center'>
          <Button onClick={() => router.push("/upload")} variant='secondary'>
            Upload Another PDF
          </Button>
        </div>
      )}
    </div>
  );
}
