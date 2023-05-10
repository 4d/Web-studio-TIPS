import { prompt } from "enquirer";

type PromptOptions = Parameters<typeof prompt>[0];

export const GroupPrompt = [
  {
    message: "Name your group",
    name: "name",
    type: "input",
    initial: 'Component Name',
    required: true,
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
