// src/index.ts
import tsj from "ts-json-schema-generator";
import { writeFile } from "fs/promises";
import glob from "glob";
import path from "path";
import { fileURLToPath } from "url";
console.log(import.meta.url);
var __filename = fileURLToPath(import.meta.url);
console.log(__filename);
var baseConfig = {
  tsconfig: "path/to/tsconfig.json",
  type: "*"
  // Default to any type, will change per file
};
var output_path = "dist/schema2.json";
var combinedSchema = {};
glob(path.resolve(__dirname, "../src/*.ai.ts"), async (err, files) => {
  if (err) {
    console.error("Error during globbing", err);
    return;
  }
  console.log(files);
  files.forEach((file) => {
    const config = {
      ...baseConfig,
      path: file
    };
    const schema = tsj.createGenerator(config).createSchema(config.type);
    const key = file.split("/").pop().replace(".ai.ts", "");
    combinedSchema[key] = schema;
  });
  await writeFile(output_path, JSON.stringify(combinedSchema, null, 2));
});
