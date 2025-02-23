// components/QuestionCard.jsx
import React from 'react';
import { 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Box,
} from '@mui/material';
let question = ''
let answer = ''


const QuestionCard = ({ question, onAnswerChange, onSubmit,originalQuestion, answer, feedback }) => {
  const handleStatementSubmit = async () => {
    console.log({
      question: `${question.question} for the problem: ${originalQuestion}`,
      options: {
        ...question.options,
      },
      user_selection: answer
    });
    try {
      const response = await fetch("http://localhost:3005/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.question,
          options: 
            question.options,
          
          user_selection: answer,
        }),
      });
      
  
      const data = await response.json();
      console.log("Received response from server:", data);
  
      // Show the explanation and hide the statement input
      // setExplanation(data.explanation);
      // setShowStatement(false);
  
      // Pass questions to parent component
      // onStatementSubmit(data.questions);
    } catch (error) {
      console.error("Error submitting statement:", error);
    }
  };
  
 
  return(
  <Card sx={{ mb: 2, p: 3 }}>
    {/* 问题标题 */}
    <Typography variant="h6" gutterBottom>
      Question: {question.question}
    </Typography>

    {/* 选项列表 */}
    <FormControl component="fieldset">
      <RadioGroup
        value={answer || ''}
        onChange={(e) => onAnswerChange(e.target.value)}
      >
        {Object.entries(question.options).map(([key, value]) => (
          <FormControlLabel
            key={key}
            value={key}
            control={<Radio />}
            label={`${key}. ${value}`}
          />
        ))}
      </RadioGroup>
    </FormControl>

    {/* 提交按钮 */}
    <Box sx={{ mt: 2, textAlign: 'center' }}>
    <Button 
      variant="contained" 
      color="primary"
      onClick={handleStatementSubmit}
      disabled={!answer}
    >
      Submit Answer
    </Button>
  </Box>
    
    {/* 反馈区域 */}
    {feedback && (
      <Paper 
        sx={{ 
          mt: 2, 
          p: 2, 
          bgcolor: feedback.isCorrect ? '#e8f5e9' : '#ffebee' 
        }}
      >
        <Typography variant="body1" gutterBottom>
          {feedback.message}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {feedback.isCorrect 
            ? feedback.explanation.correct 
            : feedback.explanation.wrong}
        </Typography>
      </Paper>
    )}
  </Card>)
};

export default QuestionCard;