const generateSummary = async (noteContent) => {
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        console.error('Groq API key is missing!');
        throw new Error('API key not configured');
    }

    if (!noteContent || noteContent.trim() === '') {
        throw new Error('No content to summarize');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant for K-12 students. Summarize notes in clear, simple bullet points that are easy to understand.'
                    },
                    {
                        role: 'user',
                        content: `Summarize these study notes in bullet points:\n\n${noteContent}`
                    }
                ],
                temperature: 0.5,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', errorText);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
        } else {
            throw new Error('Invalid response from Groq API');
        }
    } catch (error) {
        console.error('Summary Generation Error:', error);
        throw error;
    }
};

async function explainConcept(selectedText) {
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        throw new Error('API key not configured');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant for K-12 students. Explain concepts in simple, easy-to-understand language.'
                    },
                    {
                        role: 'user',
                        content: `Explain this concept clearly: ${selectedText}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Explain Error:', error);
        throw error;
    }
}

async function generateQuiz(noteContent) {
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        throw new Error('API key not configured');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant. Generate 5 multiple-choice quiz questions based on the notes provided. Format each question with the question text, 4 options (A, B, C, D), and indicate the correct answer.'
                    },
                    {
                        role: 'user',
                        content: `Generate a quiz from these notes:\n\n${noteContent}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Quiz Error:', error);
        throw error;
    }
}

async function enhanceNote(noteContent) {
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        throw new Error('API key not configured');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant. Enhance these study notes by adding relevant examples, clarifications, and organizing them better while keeping the content student-friendly.'
                    },
                    {
                        role: 'user',
                        content: `Enhance these notes:\n\n${noteContent}`
                    }
                ],
                temperature: 0.6,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Enhance Error:', error);
        throw error;
    }
}

async function getStudyTips(noteContent, subject) {
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        throw new Error('API key not configured');
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful study assistant. Provide practical study tips and strategies for K-12 students based on their notes and subject.'
                    },
                    {
                        role: 'user',
                        content: `Give study tips for ${subject}:\n\n${noteContent}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Study Tips Error:', error);
        throw error;
    }
}

export { generateSummary, explainConcept, generateQuiz, enhanceNote, getStudyTips };
