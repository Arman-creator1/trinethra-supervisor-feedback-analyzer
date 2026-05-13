const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ANALYZE ROUTE
app.post('/analyze', async (req, res) => {

  try {

    const { transcript } = req.body;

    // STRICT PROMPT FOR CLEAN JSON
    const prompt = `
You are an AI assistant.

Analyze the supervisor transcript.

IMPORTANT RULES:
- Return ONLY valid JSON
- Do NOT write explanations
- Do NOT use markdown
- Do NOT use triple backticks
- Do NOT write any text outside JSON

Return this exact structure:

{
  "extractedEvidence": [
    "evidence 1",
    "evidence 2"
  ],
  "rubricScore": {
    "overall": 7
  },
  "gapAnalysis": [
    "gap 1",
    "gap 2"
  ],
  "followUpQuestions": [
    "question 1",
    "question 2"
  ]
}

Transcript:
${transcript}
`;

    // SEND REQUEST TO OLLAMA
    const response = await fetch('http://localhost:5173/api/generate', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        model: 'phi3:mini',
        prompt,
        stream: false,
      }),
    });

    const data = await response.json();

    console.log("RAW AI RESPONSE:");
    console.log(data.response);

    // TRY PARSING JSON
    try {

      const parsedResult = JSON.parse(data.response);

      res.json({
        success: true,
        result: parsedResult,
      });

    } catch (parseError) {

      console.log("JSON PARSE ERROR:");
      console.log(parseError);

      res.status(500).json({
        success: false,
        error: 'Invalid JSON returned by AI',
        raw: data.response,
      });
    }

  } catch (error) {

    console.log("SERVER ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      error: 'Something went wrong',
    });
  }
});

// START SERVER
app.listen(5000, () => {
  console.log('Server running on port 5000');
});