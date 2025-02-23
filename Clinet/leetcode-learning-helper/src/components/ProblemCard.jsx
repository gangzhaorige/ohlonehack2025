// ProblemCard.jsx
import React, { useState } from "react";
import { Card, Typography, TextField, Button, Box, Link   } from "@mui/material";

export const ProblemCard = ({ problem, onStatementSubmit }) => {
  const [statement, setStatement] = useState("");
  const [showStatement, setShowStatement] = useState(true);
  const [explanation, setExplanation] = useState("");

  const handleStatementSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3005/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problemId: problem.id,
          statement: statement,
        }),
      });

      const data = await response.json();
      console.log("Received response from server:", data);

      // Show the explanation and hide the statement input
      setExplanation(data.explanation);
      setShowStatement(false);

      // Pass questions to parent component
      onStatementSubmit(data.questions);
    } catch (error) {
      console.error("Error submitting statement:", error);
    }
  };

  return (
    <Card sx={{ mb: 3, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {problem.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Difficulty: {problem.difficulty}
      </Typography>
      <Typography variant="body1" paragraph>
        {problem.description}
      </Typography>
      <Link
        href={`https://leetcode.com/problems/${problem.title
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ display: "block", mb: 2 }}
      >
        View on LeetCode
      </Link>
      {showStatement ? (
        <Box sx={{ mt: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your understanding of this problem"
            value={statement}
            onChange={(e) => setStatement(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleStatementSubmit}
            disabled={!statement.trim()}
          >
            Submit Understanding
          </Button>
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Problem Explanation:
          </Typography>
          <Typography variant="body1" paragraph>
            {explanation}
          </Typography>
        </Box>
      )}
    </Card>
  );
};
