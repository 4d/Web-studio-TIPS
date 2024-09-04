#!/usr/bin/env node
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

import { config } from 'dotenv';
import { parse } from 'json5';

import { IGroup, ITemplatesItem } from './interfaces';
import { formatName, validate } from './utils';

config();

const ROOT_FOLDER = resolve(__dirname, '..');
const BUILD_ROOT_FOLDER = resolve(ROOT_FOLDER, 'build');
const BUILD_FOLDER = resolve(BUILD_ROOT_FOLDER, 'build');
const templatesFile = resolve(ROOT_FOLDER, 'templates.json');

mkdirSync(BUILD_FOLDER, { recursive: true });
cpSync(resolve(ROOT_FOLDER, 'groups'), resolve(BUILD_ROOT_FOLDER, 'groups'), {
  recursive: true,
});
copyFileSync(
  resolve(ROOT_FOLDER, 'tips.json'),
  resolve(BUILD_ROOT_FOLDER, 'tips.json'),
);
copyFileSync(
  resolve(ROOT_FOLDER, 'welcometour.json5'),
  resolve(BUILD_ROOT_FOLDER, 'welcometour.json5'),
);

const {
  CI_BASE_URL = 'https://raw.githubusercontent.com/4d/Web-studio-TIPS/develop',
} = process.env;

const templates: ITemplatesItem[] = parse(readFileSync(templatesFile, 'utf-8'));

validate('groups', templates, 'Invalid templates.json file');

const result = templates.map(({ path, ...item }) => {
  const groupManifestPath = resolve(ROOT_FOLDER, path);
  const groupPath = dirname(groupManifestPath);

  const group: IGroup = parse(readFileSync(groupManifestPath, 'utf-8'));
  validate(
    'group',
    group,
    `Invalid group file: "${relative(ROOT_FOLDER, groupManifestPath)}"`,
  );

  const components = group.components.map(({ data, banner, ...component }) => {
    const content = readFileSync(resolve(groupPath, data), 'utf-8');
    const gPath = relative(ROOT_FOLDER, groupPath);
    const d = parse(
      content.replace(/__BASE__URL__/g, `${CI_BASE_URL}/${gPath}`),
    );
    validate(
      'component',
      d,
      `Invalid component file: "${relative(ROOT_FOLDER, resolve(groupPath, data))}"`,
    );

    return {
      ...component,
      banner: `${CI_BASE_URL}/${join(gPath, banner)}`,
      data: d,
    };
  });

  const gName = formatName(item.group);

  writeFileSync(
    resolve(BUILD_FOLDER, `${gName}.json`),
    JSON.stringify(components, null, 2),
  );

  return {
    ...item,
    link: `${CI_BASE_URL}/${relative(ROOT_FOLDER, 'build')}/${gName}.json`,
  };
});

writeFileSync(
  resolve(BUILD_FOLDER, 'index.json'),
  JSON.stringify(result, null, 2),
);
