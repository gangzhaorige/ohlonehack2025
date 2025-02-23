    // data/questionTemplates.js

    export const generateStandardQuestions = (problem) => {
        return [
        {
            id: `${problem.id}_q1`,
            question: "What is the main task of this problem?",
            type: "understanding",
            options: generateTaskOptions(problem)
        },
        {
            id: `${problem.id}_q2`,
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
            id: `${problem.id}_q3`,
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
            id: `${problem.id}_q4`,
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
            id: `${problem.id}_q5`,
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
            id: `${problem.id}_q6`,
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
            id: `${problem.id}_q7`,
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
            id: `${problem.id}_q8`,
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
            id: `${problem.id}_q9`,
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
            id: `${problem.id}_q10`,
            question: "What is the optimal solution approach?",
            type: "solution",
            options: generateOptimalOptions(problem)
        }
        ];
    };
    
    // 根据具体问题生成选项
    export const generateTaskOptions = (problem) => {
        return {
        "1": `Implement ${problem.title}`,
        "2": "Process the input data",
        "3": "Optimize the algorithm",
        "4": "Handle edge cases"
        };
    };
    
    const generateOptimalOptions = (problem) => {
        return {
        "1": "Use optimal data structures and algorithms",
        "2": "Implement efficient space-time trade-off",
        "3": "Apply problem-specific optimizations",
        "4": "Consider all edge cases"
        };
    };
    