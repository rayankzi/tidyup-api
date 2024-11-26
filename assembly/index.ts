import { models } from "@hypermode/modus-sdk-as";
import {
  OpenAIChatModel,
  SystemMessage,
  UserMessage,
} from "@hypermode/modus-sdk-as/models/openai/chat";

const modelName: string = "text-generator";

export function getAIRecommendations(
  treeRepresentation: string | null = null,
  additionalText: string | null = null,
): string {
  if (!treeRepresentation) return "No tree representation found.";
  if (!additionalText) return "No additional text found.";

  const instruction = `
    You are a file organization assistant tasked with analyzing directory structures, presented in a tree-like format, 
    and providing efficient, user-friendly organization recommendations. The structure will be in the following format:
    
    /folderName
      - fileName.extension (Modified: YYYY-MM-DDTHH:MM:SS.000Z)
      /subfolderName
        - fileName.extension (Modified: YYYY-MM-DDTHH:MM:SS.000Z)
    
    Your goal is to:
      1. Analyze the structure to identify patterns such as file types, naming conventions, or timestamps.
      2. Propose an optimized organization strategy, including grouping files logically and suggesting folder names.
      3. Recommend handling methods for duplicate or redundant files, unused files, or potential clutter.
      4. Maintain a clear hierarchy when reorganizing subfolders, ensuring simplicity and accessibility.
      5. Highlight ambiguities or uncertainties in the structure and suggest general best practices if needed.
      6. Use any additional user input to make your response better.
    
    Your response must include the following sections:
      1. Explanation of Recommendations: A clear explanation of your reasoning and proposed strategy.
      2. Revised Directory Tree: A reorganized tree structure clearly marked between 
          "Tree representation starts here" and "Tree representation ends here" to make it easily parsable by 
          other systems. For example:
          Tree representation starts here
          /example
            - file1.txt (Modified: 2024-11-17T12:00:00.000Z)
            /organized
              - file2.txt (Modified: 2024-11-17T13:00:00.000Z)
              - file3.txt (Modified: 2024-11-17T14:00:00.000Z)
          Tree representation ends here
       3. Additional Notes: Include any relevant suggestions, such as strategies for dealing with duplicate 
        files or handling ambiguities
    
    Use the structure and metadata provided to tailor practical and actionable suggestions 
    for optimizing file organization. Maintain a concise and professional tone in your response.
  `;
  const prompt = `
    Below is a tree representation of a directory structure that needs to be organized. 
    Your task is to analyze the structure and propose an efficient reorganization strategy.
    
    Tree representation:
    ${treeRepresentation}
    
    Here is some extra user input (note that it may be blank or have negligible info in it)
    ${additionalText}    
    
    Your tasks are to:
      1. Analyze the provided directory structure, metadata, and extra user input.
      2. Recommend how to organize the files and folders logically, 
         grouping them based on file types, names, or timestamps where appropriate
      3. Provide a revised tree representation of the directory, clearly marked as follows:
        - Start the revised tree with the line: Tree representation starts here
        - End the revised tree with the line: Tree representation ends here
      4. Include an explanation of your proposed organization and reasoning behind the changes.
      5. Offer any additional suggestions or best practices for file organization.
    
    Please ensure that your response is structured as follows:
      1. Explanation of Recommendations: Provide reasoning and insights into your organization strategy.
      2. Revised Directory Tree:
        Tree representation starts here
        [Your revised tree structure]
        Tree representation ends here
      3. Additional Notes: Highlight any ambiguities or general best practices.
  `;

  const model = models.getModel<OpenAIChatModel>(modelName);
  const input = model.createInput([
    new SystemMessage(instruction),
    new UserMessage(prompt),
  ]);

  // this is one of many optional parameters available for the OpenAI chat interface
  input.temperature = 0.7;

  const output = model.invoke(input);
  return output.choices[0].message.content.trim();
}
