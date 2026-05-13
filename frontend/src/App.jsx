import React, { useState } from 'react';
import {
  ClipboardCheck,
  BarChart3,
  AlertCircle,
  MessageSquare,
  Loader2,
  Sparkles,
  SendHorizontal,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

// CARD COMPONENT
const Card = ({
  title,
  icon: Icon,
  children,
  className = "",
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white rounded-xl p-5 shadow border ${className}`}
  >
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon size={16} className="text-blue-500" />}
      <h3 className="text-sm font-bold text-gray-600 uppercase">
        {title}
      </h3>
    </div>

    {children}
  </motion.div>
);

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // CONNECT FRONTEND TO BACKEND
  const handleRunAnalysis = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
        }),
      });

      const data = await response.json();

      console.log(data);

      // If AI returned object
      if (typeof data.result === 'object') {
        setResult(data.result);
      }

      // If AI returned JSON string
      else {
        try {
          const parsed = JSON.parse(data.result);
          setResult(parsed);
        } catch {
          alert('AI returned invalid JSON format');
          console.log(data.result);
        }
      }

    } catch (error) {
      console.log(error);
      alert('Failed to connect with backend');
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Trinethra Supervisor Feedback Analyzer
        </h1>

        <p className="text-gray-500 mt-1">
          AI-powered transcript analysis tool
        </p>
      </div>

      {/* INPUT SECTION */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">

        <textarea
          className="w-full h-52 border rounded-lg p-4 outline-none"
          placeholder="Paste supervisor transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="mt-4 px-6 py-3 bg-black text-white rounded-lg flex items-center gap-2"
        >
          {isAnalyzing ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <SendHorizontal size={18} />
          )}

          {isAnalyzing ? "Analyzing..." : "Run Analysis"}
        </button>

      </div>

      {/* EMPTY STATE */}
      {!result && !isAnalyzing && (
        <div className="text-center text-gray-400 py-20">
          <Sparkles size={48} className="mx-auto mb-4" />
          <p>Paste transcript and run analysis</p>
        </div>
      )}

      {/* LOADING */}
      {isAnalyzing && (
        <div className="text-center py-10">
          <Loader2
            className="animate-spin mx-auto text-blue-500"
            size={40}
          />

          <p className="mt-3 text-gray-500">
            AI is analyzing transcript...
          </p>
        </div>
      )}

      {/* RESULTS */}
      <AnimatePresence>

        {result && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-4"
          >

            {/* RUBRIC SCORE */}
            {result.rubricScore && (
              <Card title="Rubric Score" icon={BarChart3}>

                <h2 className="text-5xl font-bold">

                  {result.rubricScore.overall || result.rubricScore}

                  <span className="text-xl text-gray-400">
                    /10
                  </span>

                </h2>

              </Card>
            )}

            {/* EXTRACTED EVIDENCE */}
            {result.extractedEvidence && (
              <Card
                title="Extracted Evidence"
                icon={ClipboardCheck}
                className="md:col-span-2"
              >

                <div className="space-y-3">

                  {result.extractedEvidence.map((item, i) => (

                    <div key={i} className="flex gap-2">

                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />

                      <p>
                        {typeof item === 'string'
                          ? item
                          : item.feedbackFragment || JSON.stringify(item)}
                      </p>

                    </div>

                  ))}

                </div>

              </Card>
            )}

            {/* GAP ANALYSIS */}
            {result.gapAnalysis && (
              <Card title="Gap Analysis" icon={AlertCircle}>

                <div className="space-y-3">

                  {result.gapAnalysis.map((gap, i) => (

                    <div key={i}>

                      <p className="text-sm text-gray-700">

                        {typeof gap === 'string'
                          ? gap
                          : JSON.stringify(gap)}

                      </p>

                    </div>

                  ))}

                </div>

              </Card>
            )}

            {/* FOLLOW-UP QUESTIONS */}
            {result.followUpQuestions && (
              <Card
                title="Suggested Follow-up"
                icon={MessageSquare}
              >

                <ul className="list-disc pl-5 space-y-2">

                  {result.followUpQuestions.map((q, i) => (

                    <li key={i}>

                      {typeof q === 'string'
                        ? q
                        : JSON.stringify(q)}

                    </li>

                  ))}

                </ul>

              </Card>
            )}

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}
