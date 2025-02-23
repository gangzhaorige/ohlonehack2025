// data/mockProblems.js

import { generateStandardQuestions } from './questionTemplates';


// 模拟从LeetCode获取的随机题目
const leetcodeProblems = [
    {
      id: "146",
      title: "LRU Cache",
      description: "Design a data structure that implements an LRU cache with O(1) operations.",
      difficulty: "Medium",
      link: "https://leetcode.com/problems/lru-cache/"
    },
    {
      id: "200",
      title: "Number of Islands",
      description: "Given a 2D grid map of '1's (land) and '0's (water), count the number of islands.",
      difficulty: "Medium",
      link: "https://leetcode.com/problems/number-of-islands/"
    },
    {
      id: "1",
      title: "Two Sum",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
      difficulty: "Easy",
      link: "https://leetcode.com/problems/two-sum/"
    }
  ];
  
  // 问题模板生成器
  const generateQuestions = (problem) => {
    return {
      problemId: problem.id,
      questions: [
        {
          id: `${problem.id}_q1`,
          question: "What is the main task of this problem?",
          options: {
            "1": `Implement ${problem.title}`,
            "2": "Sort the array",
            "3": "Find duplicates",
            "4": "Calculate sum"
          }
        },
        {
          id: `${problem.id}_q2`,
          question: "What would be a brute force approach to solve this problem?",
          options: {
            "1": "Check all possible combinations",
            "2": "Use nested loops",
            "3": "Sort first then solve",
            "4": "Use recursion"
          }
        },
        // ... 可以添加更多标准问题
      ]
    };
  };
  
  // 模拟API响应
  const mockAnswerResponse = (answer) => {
    return {
      isCorrect: Math.random() > 0.5,
      feedback: {
        correct: "Great understanding! Your answer demonstrates good grasp of the concept.",
        wrong: "Consider reviewing the concept. Think about time and space complexity."
      }
    };
  };
  
  // 收集用户答案的数据结构
  class UserAnswersCollector {
    constructor() {
      this.answers = new Map();
    }
  
    addAnswer(problemId, questionId, answer) {
      if (!this.answers.has(problemId)) {
        this.answers.set(problemId, new Map());
      }
      this.answers.get(problemId).set(questionId, answer);
    }
  
    getAllAnswers(problemId) {
      return Object.fromEntries(this.answers.get(problemId) || new Map());
    }
  
    clearAnswers(problemId) {
      this.answers.delete(problemId);
    }
  }
  
  // 导出函数：随机获取3个问题
  export const getRandomProblems = () => {
    const shuffled = [...leetcodeProblems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).map(problem => ({
      ...problem,
      questions: generateStandardQuestions(problem)
    }));
  };
  
  export const answerCollector = new UserAnswersCollector();
  export const mockResponseGenerator = mockAnswerResponse;
  