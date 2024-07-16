// src/graphql/generateSchema.ts
import fs from "fs";
import path from "path";

// Helper function to load models
export const loadModels = (modelsPath: string) => {
  const models: any = {};
  fs.readdirSync(modelsPath).forEach((file) => {
    if (file.endsWith(".model.ts") || file.endsWith(".js")) {
      const model = require(path.join(modelsPath, file)).default;
      models[model.name] = model;
    }
  });
  return models;
};

const models = loadModels(path.join(__dirname, "../models"));

console.log(models);
