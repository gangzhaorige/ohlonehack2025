import React, { useState, useEffect } from "react";
import { Timer } from "./components/Timer";
import { ProblemCard } from "./components/ProblemCard";
import { Report } from "./components/Report";
import  QuestionCard  from "./components/QuestionCard";
import { formatTime } from "./utils/timeFormatter";
// import { mockProblems } from './data/mockProblems';
import { getRandomProblems } from "./data/mockProblems";
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
  Container,
  Card,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";

function App() {
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [problems, setProblems] = useState([]);
  const [questions, setQuestions] = useState([]); // 新增状态存储服务器返回的问题
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(false);
  const [report, setReport] = useState(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [, forceUpdate] = useState({});
  let [originalQuestion, setOriginalQuestion] = useState('');

  // 计时器逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 格式化时间
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleGenerateReport = async () => {
    try {
      setReportLoading(true);
      const reportData = {
        problemId: currentProblem.id,
        title: currentProblem.title,
        difficulty: currentProblem.difficulty,
        description: currentProblem.description,
        questions: questions,
        userAnswers: answers,
        feedback: feedback,
      };

      const response = await fetch("http://localhost:3005/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();
      console.log("Received report:", data);

      // 确保report数据被正确设置
      setReport(data);

      // 强制重新渲染
      forceUpdate();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setReportLoading(false);
    }
  };

  // 加载问题
  useEffect(() => {
    loadProblem();
  }, [currentProblemIndex]);

  useEffect(() => {
    if (problems.length > 0) {
      setCurrentProblem(problems[currentProblemIndex]);
    }
  }, [currentProblemIndex, problems]);

  useEffect(() => {
    loadProblem();
  }, []); // Load problems only once when component mounts

  useEffect(() => {
    if (currentProblem?.questions) {
      const answered = currentProblem.questions.every((q) => answers[q.id]);
      setAllQuestionsAnswered(answered);
    }
  }, [answers, currentProblem]);

  const loadProblem = async () => {
    setLoading(true);
    try {
      const newProblems = getRandomProblems();
      setProblems(newProblems); // Store all problems
      setCurrentProblem(newProblems[currentProblemIndex]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error loading problem:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatementSubmit = (newQuestions, originalQuestion) => {
    setQuestions(newQuestions);
    setOriginalQuestion(originalQuestion)
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmitAnswer = (questionId) => {
    // 模拟答案验证
    const isCorrect = Math.random() > 0.5;
    setFeedback((prev) => ({
      ...prev,
      [questionId]: {
        isCorrect,
        message: isCorrect
          ? "Correct! Great understanding!"
          : "Not quite right. Consider reviewing the concept again.",
        explanation: {
          correct:
            "This answer demonstrates good understanding of the core concepts.",
          wrong: "Common misconceptions include...",
        },
      },
    }));
  };

  const handleNextQuestion = () => {
    setCurrentProblemIndex((prev) => (prev + 1) % problems.length);
    setAnswers({});
    setFeedback({});
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Timer time={formatTime(timer)} />
      <Box sx={{ width: "90%", mx: "auto" }}>
        <ProblemCard
          problem={currentProblem}
          onStatementSubmit={handleStatementSubmit}
        />
        {questions.length > 0 && (
          <>
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id || index}
                question={question}
                originalQuestion={originalQuestion}
                onAnswerChange={(value) =>
                  handleAnswerChange(question.id, value)
                }
                onSubmit={() => handleSubmitAnswer(question.id)}
                answer={answers[question.id]}
                feedback={feedback[question.id]}
              />
            ))}
            {!report && (
              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleGenerateReport}
                  disabled={!allQuestionsAnswered}
                >
                  Generate Report
                </Button>
              </Box>
            )}
            {/* Add this section to render the Report */}
            {report && (
              <Box sx={{ mt: 4 }}>
                <Report data={report} />
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}

export default App;
