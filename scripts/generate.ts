import { prompt } from "enquirer";

import { GroupPrompt } from "./prompt";
import { IGroupAnswer, IComponent, IComponentAnswer } from "./interfaces";
import { formatName } from "./utils";

(async () => {
  const { count, name }: IGroupAnswer = await prompt(GroupPrompt);
  const components: IComponent[] = [];

  for (let i = 0; i < count; i += 1) {
    const component: IComponentAnswer = await prompt([{
      message: `[${i+1}/${count}] Name your component`,
      name: 'name',
      type: 'input',
      required: true,
      initial: `Component ${i+1}`
    }, {
      message: `[${i+1}/${count}] Describe your component`,
      name: 'description',
      type: 'input'
    }]);

    const formattedName = formatName(component.name);

    components.push({
      ...component,
      banner: `assets/${formattedName}.png`,
      data: `components/${formattedName}.json`,
    });
  }

  console.log(name, components);
})();
