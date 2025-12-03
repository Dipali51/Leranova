const Question = require('../models/question');

exports.createQuestion = async (req, res) => {
    try {
        const { question, choices, answer } = req.body;
        if (!question || !choices || !answer) return res.status(400).json({ error: 'question, choices and answer are required' });
        const choicesArray = Array.isArray(choices) ? choices : (typeof choices === 'string' ? choices.split('|').map(s => s.trim()).filter(Boolean) : []);
        if (!choicesArray.includes(answer.trim())) return res.status(400).json({ error: 'answer must be one of the choices' });
        const q = new Question({ question, choices: choicesArray, answer: answer.trim(), createdBy: req.user ? req.user.id : null });
        await q.save();
        res.status(201).json(q);
    } catch (err) {
        console.error('Error creating question:', err);
        res.status(500).json({ error: 'Failed to create question' });
    }
};

exports.listQuestions = async (req, res) => {
    try {
        const questions = await Question.find({}).sort({ createdAt: -1 });
        res.json(questions);
    } catch (err) {
        console.error('Error listing questions:', err);
        res.status(500).json({ error: 'Failed to list questions' });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const q = await Question.findById(req.params.id);
        if (!q) return res.status(404).json({ error: 'Question not found' });
        await q.remove();
        res.json({ message: 'Question deleted' });
    } catch (err) {
        console.error('Error deleting question:', err);
        res.status(500).json({ error: 'Failed to delete question' });
    }
};
