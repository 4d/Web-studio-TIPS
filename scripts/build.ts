#!/usr/bin/env node

import { config } from "dotenv";
import { parse } from "json5";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "fs";
import { resolve, dirname, relative, join } from "path";
import { ITemplatesItem, IGroup } from "./interfaces";
import { formatName } from "./utils";

config();

const ROOT_FOLDER = resolve(__dirname, "..");
const BUILD_FOLDER = resolve(ROOT_FOLDER, "build/build");
const templatesFile = resolve(ROOT_FOLDER, "templates.json");

mkdirSync(BUILD_FOLDER, { recursive: true });
copyFileSync(resolve(ROOT_FOLDER, 'tips.json'), resolve(ROOT_FOLDER, 'build/tips.json'));
copyFileSync(resolve(ROOT_FOLDER, 'welcometour.json5'), resolve(ROOT_FOLDER, 'build/welcometour.json5'));

const {
  CI_BASE_URL = "https://raw.githubusercontent.com/4d/Web-studio-TIPS/develop",
} = process.env;

const templates: ITemplatesItem[] = parse(readFileSync(templatesFile, "utf-8"));

const result = templates.map(({ path, ...item }) => {
  const groupManifestPath = resolve(ROOT_FOLDER, path);
  const groupPath = dirname(groupManifestPath);

  const group: IGroup = parse(readFileSync(groupManifestPath, "utf-8"));

  const components = group.components.map(({ data, banner, ...component }) => {
    const content = readFileSync(resolve(groupPath, data), "utf-8");
    const gPath = relative(
      ROOT_FOLDER,
      groupPath
    );
    return {
      ...component,
      banner: `${CI_BASE_URL}/${join(gPath, banner)}`,
      data: parse(content.replace(/__BASE__URL__/g, `${CI_BASE_URL}/${gPath}`)),
    };
  });

  const gName = formatName(item.group);

  writeFileSync(
    resolve(BUILD_FOLDER, `${gName}.json`),
    JSON.stringify(components, null, 2)
  );

  return {
    ...item,
    link: `${CI_BASE_URL}/${relative(ROOT_FOLDER, 'build')}/${gName}.json`,
  };
});

writeFileSync(
  resolve(BUILD_FOLDER, "index.json"),
  JSON.stringify(result, null, 2)
);
