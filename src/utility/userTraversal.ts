/* for traversing the different nodes */
import { openai } from './openai';
import { FlatSummaryNode } from './types'

async function chooseBetweenNodes(question: string, nodesToCompare: FlatSummaryNode[]) {

    let prompt = `There are ${nodesToCompare.length} pages, respectively referred as ${nodesToCompare?.map((n, index) => (`${index}${!(nodesToCompare.length - 1 == index) ? ', ' : ''}`))}. `
    for (let i = 0; i < nodesToCompare.length; i++) {
        prompt += `Page ${i} has the title ${nodesToCompare[i].title}. The summary for Page ${i} is as follows: ${nodesToCompare[i].summary}. `
    }
    prompt += `Which page should the person access for more relevant information? And how confident are you? Respond only in this format: (page),(confidence)`;

    const response = await openai.createChatCompletion({ 
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant'
            },
            {
                role: 'user',
                content: prompt
            }
        ]
    });
    const responseTuple = response.data.choices[0].message?.content.split(',')
    if (!responseTuple) {
        console.error('no response')
        return
    }
    const choice = responseTuple[0]
    const confidence = responseTuple[1]
}

export function traverseNode(data: FlatSummaryNode, question: string) {

}
