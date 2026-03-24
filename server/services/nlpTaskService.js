const { Anthropic } = require('@anthropic-ai/sdk');
const chrono = require('chrono-node');
const User = require('../models/User');

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'MISSING_KEY',
});

/**
 * Parses task description using Claude LLM
 */
const parseWithClaude = async (sentence, employees) => {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('Anthropic API Key is not configured.');
    }

    const today = new Date().toISOString().split('T')[0];
    const employeeNames = employees.map(e => e.name).join(', ');

    const prompt = `
        Today's date is ${today}.
        List of active employees: ${employeeNames}.
        
        Extract task details from this sentence: "${sentence}"
        
        Return a clean JSON object with these fields:
        - title: string (the short task action, stripped of name/date/priority words)
        - description: string (a slightly more detailed version of the task if the input is long, otherwise same as title)
        - assigneeName: string (match to the closest employee name from the list)
        - dueDate: string (YYYY-MM-DD, convert relative dates like "tomorrow" or "Friday" using today's date)
        - priority: string ("high", "medium", or "low")
        - confidence: float (0.0 to 1.0)
        
        If a field is missing, use null.
        Return ONLY the JSON. No explanation.
    `;

    try {
        const response = await anthropic.messages.create({
            model: 'claude-3-haiku-20240307',
            max_tokens: 500,
            messages: [{ role: 'user', content: prompt }],
        });

        const content = response.content[0].text;
        const parsed = JSON.parse(content);
        return { ...parsed, parsedBy: 'Claude' };
    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
};

/**
 * Parses task description using local Regex and Chrono-node
 */
const parseWithRegex = (sentence, employees) => {
    let description = sentence;
    let title = sentence;
    let assigneeName = null;
    let dueDate = null;
    let priority = 'medium';
    let confidence = 0.5;

    // 1. Extract Date
    const dateResults = chrono.parse(sentence);
    if (dateResults.length > 0) {
        dueDate = dateResults[0].start.date().toISOString().split('T')[0];
        title = title.replace(dateResults[0].text, '');
        confidence += 0.15;
    }

    // 2. Extract Priority
    const lower = sentence.toLowerCase();
    if (/\b(urgent|asap|critical|high)\b/.test(lower)) {
        priority = 'high';
        confidence += 0.15;
        title = title.replace(/\b(urgent|asap|critical|high)\b/gi, '');
    } else if (/\b(low|whenever|no rush)\b/.test(lower)) {
        priority = 'low';
        confidence += 0.1;
        title = title.replace(/\b(low|whenever|no rush)\b/gi, '');
    }

    // 3. Extract Assignee
    let assigneeStrippedSentence = sentence;
    for (const emp of employees) {
        if (sentence.toLowerCase().includes(emp.name.toLowerCase())) {
            assigneeName = emp.name;
            confidence += 0.2;
            const safeName = emp.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const nameRegex = new RegExp(safeName, 'gi');
            title = title.replace(nameRegex, '');
            assigneeStrippedSentence = assigneeStrippedSentence.replace(nameRegex, '');
            break;
        }
    }

    // Cleanup Title: Remove connector words and leading/trailing punctuation
    const stopWords = ['assign', 'task', 'due', 'on', 'priority', 'by', 'for', 'with', 'to', 'at', 'in', 'please', 'need', 'me', 'the'];
    const stopWordsRegex = new RegExp(`\\b(${stopWords.join('|')})\\b`, 'gi');
    
    let cleanedTitle = title.replace(stopWordsRegex, '')
                 .replace(/\s+/g, ' ')
                 .replace(/^[,.\s-]+|[,.\s-]+$/g, '')
                 .trim();

    // Natural Description: Original sentence minus the assignee and priority keywords
    let finalDescription = assigneeStrippedSentence
        .replace(/\b(high|medium|low|urgent|asap|critical|priority)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    return {
        title: (cleanedTitle.length > 3 ? cleanedTitle : title).charAt(0).toUpperCase() + (cleanedTitle.length > 3 ? cleanedTitle.slice(1) : title.slice(1)),
        description: finalDescription || sentence,
        assigneeName,
        dueDate,
        priority,
        confidence: Math.min(confidence, 1),
        parsedBy: 'Regex'
    };
};

/**
 * Resolves an employee name to a User ObjectId
 */
const resolveEmployee = (name, employees) => {
    if (!name) return null;
    const match = employees.find(e => e.name.toLowerCase() === name.toLowerCase());
    return match ? match._id : null;
};

/**
 * Main Orchestrator
 */
const parseTask = async (sentence, employees) => {
    let result;
    try {
        result = await parseWithClaude(sentence, employees);
    } catch (err) {
        console.log('Falling back to Regex parsing...');
        result = parseWithRegex(sentence, employees);
    }

    // Resolve MongoDB ID
    const assignedTo = resolveEmployee(result.assigneeName, employees);
    
    return {
        ...result,
        assignedTo
    };
};

module.exports = {
    parseTask
};
