const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "YOUR_OPENROUTER_KEY",
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:free",
      messages: [
        {
          role: "user",
          content: "Say hello in one sentence."
        }
      ]
    });

    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
  }
}

test();
