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

export const QuestionCard = ({ question, onAnswerChange, onSubmit, answer, feedback }) => (
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
      onClick={onSubmit}
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
  </Card>
);
