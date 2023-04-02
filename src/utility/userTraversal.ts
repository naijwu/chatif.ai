/* for traversing the different nodes */
import { openai } from "./openai";
import { TreeNode } from "./types";

export async function chooseBetweenNodes(
  question: string,
  nodesToCompare: TreeNode[],
  returnCount = 2
) {
  let prompt = `There are ${
    nodesToCompare.length
  } pages, respectively referred as ${nodesToCompare?.map(
    (n, index) => `${index}${!(nodesToCompare.length - 1 == index) ? ", " : ""}`
  )}.`;
  prompt += `\n\n\nAfter reading all the page summaries outlined below, rank the page indices by how likely the person is to find the answer for the question: "${question}" on the corresponding page. Your answer must be formatted as a JSON array, sorted from most to least relevant.`;
  for (let i = 0; i < nodesToCompare.length; i++) {
    prompt += `\n\n\nPage ${i} has the title ${nodesToCompare[i].title}. The summary for Page ${i} is as follows: ${nodesToCompare[i].summary}`;
  }
  prompt += `\n\n\nRank the page indices by how likely the person is to find the answer for the question: "${question}" on the corresponding page. Your answer must be formatted as a JSON array, sorted from most to least relevant.`;

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Your responses are always in the format of a JSON array of numbers.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  const result = response.data.choices[0].message?.content || "";
  const rankings = findArray(result) || [];
  console.log(result);

  return rankings.map((i: number) => nodesToCompare[i]).slice(0, returnCount);
}

function findArray(str: string): number[] | null {
  const regex = /\[[\d,\s]*\]/; // Match any array of numbers inside square brackets
  const match = str.match(regex);
  if (match) {
    const arr = JSON.parse(match[0]);
    return arr;
  }
  return null;
}
