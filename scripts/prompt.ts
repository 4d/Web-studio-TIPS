import { prompt } from "enquirer";
import { existsSync } from 'fs';
import { formatName } from "./utils";

type PromptOptions = Parameters<typeof prompt>[0];

export const GroupPrompt = [
  {
    message: "Name your group",
    name: "name",
    type: "input",
    initial: 'Group Name',
    required: true,
    validate(value) {
      const formattedName = formatName(value);

      if (existsSync(`groups/${formattedName}`))
        return "Already exists. Choose another name";

      return true;
    }
  },
  {
    message: "How many components?",
    name: "count",
    initial: 1,
    type: 'input',
    required: true,
    validate(value) {
      const count = +value;
      if (isNaN(+value) || count < 0)
        return "The value should be a valid positive number";
      return true;
    },
    result(value) {
      return Math.floor(+value);
    },
  },
] as PromptOptions;
