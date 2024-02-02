import { prompt } from 'enquirer';
import { parse } from 'json5';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';

import { GroupPrompt } from './prompt';
import { IGroupAnswer, IComponent, IComponentAnswer } from './interfaces';
import { formatName } from './utils';

const templates = parse(readFileSync('templates.json', 'utf-8'));

(async () => {
  const { count, name }: IGroupAnswer = await prompt(GroupPrompt);
  const components: IComponent[] = [];

  for (let i = 0; i < count; i += 1) {
    const component: IComponentAnswer = await prompt([
      {
        message: `[${i + 1}/${count}] Name your component`,
        name: 'name',
        type: 'input',
        required: true,
        initial: `Component ${i + 1}`,
        validate(value) {
          if (components.find((c) => c.name === value))
            return 'Choose another name';
          return true;
        },
      },
      {
        message: `[${i + 1}/${count}] Describe your component`,
        name: 'description',
        type: 'input',
      },
    ]);

    const formattedCompName = formatName(component.name);

    components.push({
      ...component,
      banner: `assets/${formattedCompName}.png`,
      data: `components/${formattedCompName}.json`,
    });
  }

  // Create group
  const formattedName = formatName(name);
  mkdirSync(`groups/${formattedName}/assets`, { recursive: true });
  mkdirSync(`groups/${formattedName}/components`, { recursive: true });
  writeFileSync(
    `groups/${formattedName}/manifest.json`,
    JSON.stringify({ components }, null, 2),
  );
  writeFileSync(
    'templates.json',
    JSON.stringify(
      [
        ...templates,
        {
          group: name,
          icon: 'fa fa-code',
          tags: ['template'],
          path: `groups/${formattedName}/manifest.json`,
        },
      ],
      null,
      2,
    ),
  );

  // Create folders
  for (const component of components) {
    writeFileSync(
      `groups/${formattedName}/components/${formatName(component.name)}.json`,
      '{}',
    );
  }
})();
