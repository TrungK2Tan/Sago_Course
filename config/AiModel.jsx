const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "application/json",
};

export const GenerateTopicsAIModel = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Learn Python: As your are coaching teacher\n-User want to learn about the topic\n-Generate 5-7 Course title for study(Short)\n-Make sure it is releated to description\n-Output will be ARRAY of String in JSON FORMAT only\n-Do not add anu plain text in output",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "course_titles": [\n    "Python Fundamentals: A Beginner\'s Guide",\n    "Python Data Structures and Algorithms",\n    "Object-Oriented Programming with Python",\n    "Python for Data Science: Essential Tools",\n    "Web Development with Python and Frameworks",\n    "Automating Tasks with Python Scripting",\n    "Python and Machine Learning: A Practical Introduction"\n  ]\n}\n```',
        },
      ],
    },
  ],
});

export const GenerateCourseAIModel = model.startChat({
  generationConfig,
  history: [],
});
