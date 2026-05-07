import { env } from '../config/env';

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const callGroq = async (prompt: string, jsonMode: boolean = false): Promise<string> => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: jsonMode ? { type: 'json_object' } : undefined,
      temperature: 0.1
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API Error: ${JSON.stringify(error)}`);
  }

  const data = await response.json() as GroqResponse;
  return data.choices[0].message.content;
};
