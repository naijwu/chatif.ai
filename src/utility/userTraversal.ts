/* for traversing the different nodes */
import { openai } from "./openai";
import { TreeNode } from "./types";

export async function chooseBetweenNodes(
  question: string,
  nodesToCompare: TreeNode[]
) {
  let prompt = `There are ${
    nodesToCompare.length
  } pages, respectively referred as ${nodesToCompare?.map(
    (n, index) => `${index}${!(nodesToCompare.length - 1 == index) ? ", " : ""}`
  )}.`;
  prompt += `\n\n\nAfter reading all the page summaries outlined below, tell me which page the person should access for more relevant information for answering the question: "${question}". Your answer must be a single number, denoting the page number.`;
  for (let i = 0; i < nodesToCompare.length; i++) {
    prompt += `\n\n\nPage ${i} has the title ${nodesToCompare[i].title}. The summary for Page ${i} is as follows: ${nodesToCompare[i].summary}`;
  }
  prompt += `\n\n\nWhich page should the person access for more relevant information for answering the question: "${question}"? Your answer must be a single number, denoting the page number.`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Your responses are always a single number, with no other characters.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const result = response.data.choices[0].message?.content || "";
  return nodesToCompare[parseFirstNumber(result) || 0];
}

function parseFirstNumber(str: string) {
  const match = str.match(/\d+/); // find the first number in the string using regex
  if (match) {
    return parseInt(match[0]); // parse the matched number as an integer
  }
  return null; // return null if no number is found in the string
}
