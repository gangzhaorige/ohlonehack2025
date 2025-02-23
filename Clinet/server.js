// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3005;

app.use(cors());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
  });
  
app.use(bodyParser.json());

// 添加generateQuestions函数定义
function generateQuestions(problemId) {
    return [
        {
            id: `${problemId}_q1`,
            question: "What is the main task of this problem?",
            type: "understanding",
            options: {
                "1": "Find two numbers that add up to target",
                "2": "Sort the array",
                "3": "Find maximum number",
                "4": "Count array elements"
            }
        },
        {
            id: `${problemId}_q2`,
            question: "What data structures would be most appropriate for this problem?",
            type: "data_structure",
            options: {
            "1": "Array/List",
            "2": "Hash Map/Set",
            "3": "Stack/Queue",
            "4": "Tree/Graph"
            }
        },
        {
            id: `${problemId}_q3`,
            question: "What would be a brute force approach to solve this problem?",
            type: "approach",
            options: {
            "1": "Check all possible combinations",
            "2": "Use nested loops for comparison",
            "3": "Sort first then process",
            "4": "Use recursion to explore all possibilities"
            }
        },
        {
            id: `${problemId}_q4`,
            question: "Why is the brute force approach not efficient?",
            type: "analysis",
            options: {
            "1": "High time complexity due to nested operations",
            "2": "Excessive memory usage",
            "3": "Redundant calculations",
            "4": "Poor handling of edge cases"
            }
        },
        {
            id: `${problemId}_q5`,
            question: "What is the time complexity of the brute force approach?",
            type: "complexity",
            options: {
            "1": "O(n)",
            "2": "O(n log n)",
            "3": "O(n^2)",
            "4": "O(2^n)"
            }
        },
        {
            id: `${problemId}_q6`,
            question: "How can we optimize the solution?",
            type: "optimization",
            options: {
            "1": "Use appropriate data structures",
            "2": "Apply dynamic programming",
            "3": "Use two pointers technique",
            "4": "Implement binary search"
            }
        },
        {
            id: `${problemId}_q7`,
            question: "What is the space complexity of the optimal solution?",
            type: "complexity",
            options: {
            "1": "O(1)",
            "2": "O(n)",
            "3": "O(n log n)",
            "4": "O(n^2)"
            }
        },
        {
            id: `${problemId}_q8`,
            question: "What edge cases should we consider?",
            type: "edge_cases",
            options: {
            "1": "Empty input",
            "2": "Single element input",
            "3": "Duplicate elements",
            "4": "Maximum/Minimum values"
            }
        },
        {
            id: `${problemId}_q9`,
            question: "Which algorithmic technique is most suitable?",
            type: "technique",
            options: {
            "1": "Divide and Conquer",
            "2": "Dynamic Programming",
            "3": "Greedy Algorithm",
            "4": "Backtracking"
            }
        },
        {
            id: `${problemId}_q10`,
            question: "What is the optimal solution approach?",
            type: "solution",
            options: {
                "1": "Use a combination of HashMap and Doubly Linked List",
                "2": "Use a single data structure with custom methods",
                "3": "Implement a basic array-based solution",
                "4": "Use built-in JavaScript Map object"
            }
        }
    ];
}

app.post('/analyze', (req, res) => {
    const { problemId, statement } = req.body;
    console.log('Received statement:', statement);
    
    // 返回问题解释和问题列表
    res.json({
        explanation: "The Two Sum problem requires finding two numbers in an array that add up to a target value. The key is to efficiently search for complementary numbers.",
        questions: generateQuestions(problemId)
    });
});

app.post('/generate-report', (req, res) => {
    const reportData = req.body;
    console.log('Received report data:', reportData);
    
    try {
        const reportData = req.body;
        console.log('Received report data:', reportData);
        
        if (!reportData) {
            return res.status(400).json({ error: 'No report data provided' });
        }

        res.json({
            problemId: reportData.problemId,
            title: reportData.title,
            difficulty: reportData.difficulty,
            description: reportData.description,
            questions: reportData.questions,
            userAnswers: reportData.userAnswers,
            feedback: reportData.feedback
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log('POST /analyze');
    console.log('POST /generate-report');
});

