"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export default function Analysis() {
  const [analysis, setAnalysis] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const jwt = localStorage.getItem("jwt_token");

    if (!userId || !jwt) {
      router.push("/");
      return;
    }

    const analysisData = localStorage.getItem("analysis_data");
    if (!analysisData) {
      router.push("/dashboard");
      return;
    }

    try {
      const parsedAnalysis = JSON.parse(analysisData);
      setAnalysis(parsedAnalysis);
    } catch (err) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleNewQuiz = () => {
    localStorage.removeItem("quiz_data");
    localStorage.removeItem("analysis_data");
    router.push("/upload");
  };

  if (!analysis) {
    return (
      <div className='max-w-2xl mx-auto mt-16 p-8'>
        <div>Loading results...</div>
      </div>
    );
  }

  const scoreNum = parseInt(analysis.score?.replace("%", "") || "0");
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Excellent!";
    if (score >= 60) return "Good job!";
    if (score >= 40) return "Keep practicing!";
    return "Room for improvement";
  };

  return (
    <div className='max-w-2xl mx-auto mt-16 p-8'>
      <div className='mb-6'>
        <Button onClick={() => router.push("/dashboard")} className='mb-4'>
          Back to Dashboard
        </Button>
        <h2 className='text-2xl font-bold'>Quiz Results</h2>
      </div>

      <div className='space-y-6'>
        {/* Score Section */}
        <div className={`p-6 rounded-lg border-2 ${getScoreColor(scoreNum)}`}>
          <div className='text-center'>
            <div className='text-4xl font-bold mb-2'>{analysis.score}</div>
            <div className='text-lg font-semibold'>
              {getScoreMessage(scoreNum)}
            </div>
          </div>
        </div>

        {/* Overall Performance */}
        {analysis.analysis?.overall_performance && (
          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='font-bold text-lg mb-3'>Overall Performance</h3>
            <p className='text-gray-700 leading-relaxed'>
              {analysis.analysis.overall_performance}
            </p>
          </div>
        )}

        {/* Strong Areas */}
        {analysis.analysis?.strong_areas &&
          analysis.analysis.strong_areas.length > 0 && (
            <div className='bg-green-50 p-6 rounded-lg border border-green-200'>
              <h3 className='font-bold text-lg mb-3 text-green-800'>
                Strong Areas
              </h3>
              <ul className='space-y-2'>
                {analysis.analysis.strong_areas.map(
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

        {/* Areas for Improvement */}
        {analysis.analysis?.weak_areas &&
          analysis.analysis.weak_areas.length > 0 && (
            <div className='bg-orange-50 p-6 rounded-lg border border-orange-200'>
              <h3 className='font-bold text-lg mb-3 text-orange-800'>
                Areas for Improvement
              </h3>
              <ul className='space-y-2'>
                {analysis.analysis.weak_areas.map(
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

        {/* Recommendations */}
        {analysis.analysis?.recommendations &&
          analysis.analysis.recommendations.length > 0 && (
            <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
              <h3 className='font-bold text-lg mb-3 text-blue-800'>
                Recommendations
              </h3>
              <ul className='space-y-2'>
                {analysis.analysis.recommendations.map(
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

        {/* Action Buttons */}
        <div className='flex space-x-4 pt-4'>
          <Button onClick={handleNewQuiz} className='flex-1'>
            Take Another Quiz
          </Button>

          <Button
            onClick={() => router.push("/dashboard")}
            variant='secondary'
            className='flex-1'
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
