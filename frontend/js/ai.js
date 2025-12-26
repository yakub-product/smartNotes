const API_BASE_URL = '/api';

async function summarizeNote(noteContent) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ noteContent })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to summarize note');
        }

        return data.summary;
    } catch (error) {
        console.error('Summarize Error:', error);
        throw error;
    }
}

async function explainConcept(selectedText) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/explain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedText })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to explain concept');
        }

        return data.explanation;
    } catch (error) {
        console.error('Explain Error:', error);
        throw error;
    }
}

async function generateQuiz(noteContent) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ noteContent })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate quiz');
        }

        return data.quiz;
    } catch (error) {
        console.error('Quiz Error:', error);
        throw error;
    }
}

async function enhanceNote(noteContent) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/enhance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ noteContent })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to enhance notes');
        }

        return data.enhancedNotes;
    } catch (error) {
        console.error('Enhance Error:', error);
        throw error;
    }
}

async function getStudyTips(noteContent, subject) {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/study-tips`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ noteContent, subject })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate study tips');
        }

        return data.studyTips;
    } catch (error) {
        console.error('Study Tips Error:', error);
        throw error;
    }
}

export { summarizeNote, explainConcept, generateQuiz, enhanceNote, getStudyTips };
