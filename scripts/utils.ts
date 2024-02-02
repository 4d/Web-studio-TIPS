import Ajv, { ErrorObject } from 'ajv';

import groupsSchema from './schemas/groups.schema.json';
import groupSchema from './schemas/group.schema.json';
import componentSchema from './schemas/component.schema.json';

const ajv = new Ajv({ allErrors: false });

const validateGroups = ajv.compile(groupsSchema);
const validateGroup = ajv.compile(groupSchema);
const validateComponent = ajv.compile(componentSchema);

export function formatName(name: string) {
  return name
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('-');
}

export function validate(
  type: 'groups' | 'group' | 'component',
  data: unknown,
  message: string,
) {
  let errors: unknown;
  switch (type) {
    case 'groups':
      validateGroups(data);
      ({ errors } = validateGroups);
      break;
    case 'group':
      validateGroup(data);
      ({ errors } = validateGroup);
      break;
    case 'component':
      validateComponent(data);
      ({ errors } = validateComponent);
      break;
  }

  if (errors) {
    console.error(message);
    console.log(errors);
    process.exit(1);
  }
}
