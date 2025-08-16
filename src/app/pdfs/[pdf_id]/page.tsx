"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui";

export default function QuizHistory() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const pdfId = params.pdf_id;

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (!userId || !jwt) {
      router.push("/");
      return;
    }

    if (pdfId) {
      fetchQuizHistory(pdfId as string);
    }
  }, [router, pdfId]);

  const fetchQuizHistory = async (pdfId: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/pdf-quiz-history/${pdfId}`
      );
      const result = await response.json();

      if (result.success) {
        setData(result);
      } else {
        setError("Failed to load quiz history");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const getAnswerColor = (status: string) => {
    switch (status) {
      case "correct":
        return "text-green-600 bg-green-50 border-green-200";
      case "incorrect":
        return "text-red-600 bg-red-50 border-red-200";
      case "skipped":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return "✓";
      case "incorrect":
        return "✗";
      case "skipped":
        return "—";
      default:
        return "?";
    }
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto mt-16 p-8'>
        <div className='text-center py-8'>Loading quiz history...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className='max-w-4xl mx-auto mt-16 p-8'>
        <Button onClick={() => router.push("/pdfs")} className='mb-6'>
          Back to PDFs
        </Button>
        <div className='text-center py-8 text-red-600'>{error}</div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto mt-16 p-8'>
      <div className='mb-6'>
        <Button onClick={() => router.push("/pdfs")} className='mb-4'>
          Back to PDFs
        </Button>

        <div className='bg-gray-50 p-6 rounded-lg mb-6'>
          <h1 className='text-2xl font-bold mb-2'>
            {data.pdf_info.original_name}
          </h1>
          <p className='text-gray-600'>
            Uploaded: {new Date(data.pdf_info.uploaded_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {!data.quiz_taken ? (
        <div className='text-center py-12 bg-blue-50 rounded-lg'>
          <h3 className='text-lg font-medium text-blue-900 mb-2'>
            Quiz Not Taken Yet
          </h3>
          <p className='text-blue-700 mb-4'>
            A quiz has been generated for this PDF but hasn't been completed.
          </p>

          <div className='space-y-4 max-w-2xl mx-auto'>
            <h4 className='font-semibold'>Available Questions:</h4>
            {data.questions.map((question: any, index: number) => (
              <div
                key={index}
                className='text-left bg-white p-4 rounded border'
              >
                <p className='font-medium mb-2'>
                  {index + 1}. {question.question}
                </p>
                <div className='grid grid-cols-2 gap-2 text-sm'>
                  {Object.entries(question.options).map(([key, value]) => (
                    <div key={key} className='text-gray-600'>
                      {key}) {value as string}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Button onClick={() => router.push("/upload")} className='mt-6'>
            Generate New Quiz
          </Button>
        </div>
      ) : (
        <>
          {/* Score Overview */}
          <div className='bg-blue-50 p-6 rounded-lg border border-blue-200 mb-8'>
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='text-xl font-bold text-blue-900'>
                  Quiz Results
                </h2>
                <p className='text-blue-700'>
                  Completed:{" "}
                  {new Date(data.analysis.completed_at).toLocaleDateString()}
                </p>
              </div>
              <div className='text-right'>
                <div className='text-3xl font-bold text-blue-600'>
                  {data.analysis.score}
                </div>
                <div className='text-sm text-blue-700'>Final Score</div>
              </div>
            </div>
          </div>

          {/* Questions and Answers */}
          <div className='space-y-6 mb-8'>
            <h3 className='text-xl font-bold'>Question by Question Review</h3>

            {data.quiz_history.map((item: any, index: number) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-6'
              >
                <div className='flex items-start justify-between mb-4'>
                  <h4 className='text-lg font-semibold flex-1'>
                    {index + 1}. {item.question}
                  </h4>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded border ml-4 ${getAnswerColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)} {item.status || "Unknown"}
                  </span>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {Object.entries(item.options).map(([key, value]) => {
                    const isCorrect = key === item.correct_answer;
                    const isUserAnswer = key === item.user_answer;

                    let bgColor = "";
                    if (isCorrect && isUserAnswer) {
                      bgColor = "bg-green-100 border-green-300"; // Correct answer selected
                    } else if (isCorrect) {
                      bgColor = "bg-green-50 border-green-200"; // Correct answer not selected
                    } else if (isUserAnswer) {
                      bgColor = "bg-red-100 border-red-300"; // Wrong answer selected
                    } else {
                      bgColor = "bg-gray-50 border-gray-200"; // Not selected
                    }

                    return (
                      <div
                        key={key}
                        className={`p-3 rounded border ${bgColor}`}
                      >
                        <div className='flex items-center space-x-2'>
                          {isUserAnswer && (
                            <span className='text-blue-600 font-bold'>→</span>
                          )}
                          {isCorrect && (
                            <span className='text-green-600 font-bold'>✓</span>
                          )}
                          <span className='font-medium'>{key})</span>
                          <span>{value as string}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className='mt-3 text-sm text-gray-600'>
                  <span className='font-medium'>Your answer:</span>{" "}
                  {item.user_answer || "Not answered"} |
                  <span className='font-medium'> Correct answer:</span>{" "}
                  {item.correct_answer}
                </div>
              </div>
            ))}
          </div>

          {/* Analysis Section */}
          <div className='space-y-6'>
            <h3 className='text-xl font-bold'>Detailed Analysis</h3>

            {data.analysis.overall_performance && (
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h4 className='font-bold mb-3'>Overall Performance</h4>
                <p className='text-gray-700'>
                  {data.analysis.overall_performance}
                </p>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {data.analysis.strong_areas &&
                data.analysis.strong_areas.length > 0 && (
                  <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
                    <h4 className='font-bold text-green-800 mb-3'>
                      Strong Areas
                    </h4>
                    <ul className='space-y-2'>
                      {data.analysis.strong_areas.map(
                        (area: string, index: number) => (
                          <li key={index} className='flex items-start'>
                            <span className='text-green-600 mr-2'>✓</span>
                            <span className='text-gray-700'>{area}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              {data.analysis.weak_areas &&
                data.analysis.weak_areas.length > 0 && (
                  <div className='bg-orange-50 p-6 rounded-lg border border-orange-200'>
                    <h4 className='font-bold text-orange-800 mb-3'>
                      Areas for Improvement
                    </h4>
                    <ul className='space-y-2'>
                      {data.analysis.weak_areas.map(
                        (area: string, index: number) => (
                          <li key={index} className='flex items-start'>
                            <span className='text-orange-600 mr-2'>→</span>
                            <span className='text-gray-700'>{area}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>

            {data.analysis.recommendations &&
              data.analysis.recommendations.length > 0 && (
                <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
                  <h4 className='font-bold text-blue-800 mb-3'>
                    Recommendations
                  </h4>
                  <ul className='space-y-2'>
                    {data.analysis.recommendations.map(
                      (rec: string, index: number) => (
                        <li key={index} className='flex items-start'>
                          <span className='text-blue-600 mr-2'>💡</span>
                          <span className='text-gray-700'>{rec}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>

          <div className='mt-8 text-center'>
            <Button onClick={() => router.push("/upload")} variant='secondary'>
              Generate New Quiz
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
