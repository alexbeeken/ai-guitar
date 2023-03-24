import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const chord = req.body.chord || '';
  if (chord.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid chord",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(chord),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(chord) {
  return `Can you suggest a guitar chord?

G chord is [3, 0, 0, 0, 2, 3]
C7 chord is [0, 1, 3, 2, 3, 0]
Fmaj7 chord is [0, 1, 2, 3, 3, 1]
D chord is [2, 3, 2, 0, 0, 2]
E chord is [0, 0, 1, 2, 2, 0]
${chord} is`;
}
