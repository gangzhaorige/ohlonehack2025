// components/Report.jsx
import React from "react";
import { Card, Typography, Box, Link, Divider, Button } from "@mui/material";

export const Report = ({ data }) => {
  return (
    <Card sx={{ mt: 4, p: 3, bgcolor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom>
        Problem Report
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Problem Details */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Problem Details
        </Typography>
        <Typography>Problem ID: {data.problemId}</Typography>
        <Typography>Title: {data.title}</Typography>
        <Typography>Difficulty: {data.difficulty}</Typography>
        <Typography paragraph>Description: {data.description}</Typography>
        <Link
          href={`https://leetcode.com/problems/${data.title
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Original Problem on LeetCode
        </Link>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Questions and Answers */}
      <Typography variant="h6" gutterBottom>
        Questions and Answers
      </Typography>
      {data.questions?.map((question, index) => (
        <Box
          key={index}
          sx={{ mb: 2, p: 2, bgcolor: "white", borderRadius: 1 }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Question {index + 1}: {question.question}
          </Typography>
          <Typography color="text.secondary">
            Your Answer: Option {data.userAnswers[question.id]}(
            {question.options[data.userAnswers[question.id]]})
          </Typography>
          <Typography
            sx={{
              color: data.feedback[question.id]?.isCorrect
                ? "success.main"
                : "error.main",
              fontWeight: "bold",
            }}
          >
            Correct Answer: Option {question.correctOption}(
            {question.options[question.correctOption]})
          </Typography>
          <Typography sx={{ mt: 1, color: "text.secondary" }}>
            Explanation:{" "}
            {
              data.feedback[question.id]?.explanation[
                data.feedback[question.id]?.isCorrect ? "correct" : "wrong"
              ]
            }
          </Typography>
        </Box>
      ))}

      {/* Navigation Buttons */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => (window.location.href = "/")}
        >
          Try Another Problem
        </Button>
        <Button variant="outlined" onClick={() => window.close()}>
          Quit and Close the Web
        </Button>
      </Box>
    </Card>
  );
};
