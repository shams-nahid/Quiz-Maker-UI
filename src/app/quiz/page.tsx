"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { API_BASE_URL } from "./../../config";

export default function Quiz() {
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (!userId || !jwt) {
      router.push("/");
      return;
    }

    const quizData = localStorage.getItem("quiz_data");
    if (!quizData) {
      router.push("/dashboard");
      return;
    }

    try {
      const parsedQuiz = JSON.parse(quizData);
      setQuiz(parsedQuiz);
    } catch (err) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleAnswer = (answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [currentQuestion + 1]: answer
    });
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError("");

    try {
      const answers = Object.entries(userAnswers).map(
        ([questionNum, answer]) => ({
          question_number: parseInt(questionNum),
          user_answer: answer
        })
      );

      const response = await fetch(`${API_BASE_URL}/analyze-quiz-performance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          quiz_id: quiz.quiz_id,
          user_id: localStorage.getItem("user_id"),
          user_answers: answers
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("analysis_data", JSON.stringify(data));
        router.push("/analysis");
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (err) {
      setError("Submission error. Please try again.");
    }

    setSubmitting(false);
  };

  const isQuizComplete = () => {
    if (!quiz) return false;
    return quiz.questions.every(
      (_: any, index: number) => userAnswers[index + 1]
    );
  };

  const answeredQuestions = Object.keys(userAnswers).length;
  const totalQuestions = quiz?.questions?.length || 0;

  if (!quiz) {
    return (
      <div className='max-w-2xl mx-auto mt-16 p-8'>
        <div>Loading quiz...</div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className='max-w-2xl mx-auto mt-16 p-8'>
      <div className='mb-6'>
        <Button onClick={() => router.push("/dashboard")} className='mb-4'>
          Back to Dashboard
        </Button>

        <div className='flex justify-between items-center mb-4'>
          <span className='text-sm text-gray-600'>
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className='text-sm text-blue-600'>
            Answered: {answeredQuestions}/{totalQuestions}
          </span>
        </div>

        <div className='w-full bg-gray-200 rounded-full h-2'>
          <div
            className='bg-blue-600 h-2 rounded-full transition-all duration-300'
            style={{
              width: `${((currentQuestion + 1) / totalQuestions) * 100}%`
            }}
          ></div>
        </div>
      </div>

      <h2 className='text-xl font-bold mb-6'>{question?.question}</h2>

      <div className='space-y-3 mb-8'>
        {Object.entries(question?.options || {}).map(([key, value]) => (
          <label
            key={key}
            className='flex items-start space-x-3 cursor-pointer p-3 border rounded-md hover:bg-gray-50'
          >
            <input
              type='radio'
              name='answer'
              value={key}
              checked={userAnswers[currentQuestion + 1] === key}
              onChange={e => handleAnswer(e.target.value)}
              className='w-4 h-4 mt-1 flex-shrink-0'
            />
            <span className='text-sm'>
              <strong>{key})</strong> {value}
            </span>
          </label>
        ))}
      </div>

      <div className='flex justify-between items-center'>
        <Button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          variant='secondary'
        >
          Previous
        </Button>

        <div className='flex space-x-3'>
          {currentQuestion < totalQuestions - 1 ? (
            <Button onClick={() => setCurrentQuestion(currentQuestion + 1)}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              disabled={submitting || !isQuizComplete()}
              className='px-8'
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>

      {!isQuizComplete() && currentQuestion === totalQuestions - 1 && (
        <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
          <p className='text-sm text-yellow-800'>
            Please answer all questions before submitting.
          </p>
        </div>
      )}

      {error && <div className='mt-4 text-red-600 text-sm'>{error}</div>}
    </div>
  );
}
