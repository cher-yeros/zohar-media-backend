// src/scripts/generateGraphQLSchemas.ts
import fs from "fs";
import path from "path";
import { AbstractDataType } from "sequelize";
import { Model, DataType, ModelCtor } from "sequelize-typescript";
import sequelize from "../utils/db.connection";

sequelize;
// Define the type for the models dictionary

interface ModelInfo {
  model: ModelCtor;
  filename: string;
}

interface ModelsDictionary {
  [key: string]: ModelInfo;
}

// Helper function to load models
const loadModels = (modelsPath: string): ModelsDictionary => {
  const models: ModelsDictionary = {};
  fs.readdirSync(modelsPath).forEach((file) => {
    if (file.endsWith(".ts") || file.endsWith(".js")) {
      const model = require(path.join(modelsPath, file)).default;

      models[model.name] = { model, filename: file };
    }
  });
  return models;
};

const models = loadModels(path.join(__dirname, "../models"));

// src/scripts/generateGraphQLSchemas.ts
const generateGraphQLSchema = (model: ModelCtor) => {
  const modelName = model.name;
  const fields: Record<string, string> = {};

  const createInputFields: Record<string, string> = {};
  const updateInputFields: Record<string, string> = {};

  for (const attribute in model.getAttributes()) {
    // const attributeType = model.rawAttributes[attribute].type as DataType;

    let graphqlType: string;

    const attributeType = (
      model.getAttributes()[attribute].type as AbstractDataType
    ).key;

    const allowNull = !!model.getAttributes()[attribute].allowNull;
    const attr = model.getAttributes()[attribute];

    const isPrimaryKey = !!model.getAttributes()[attribute].primaryKey;
    const autoIncrement = !!model.getAttributes()[attribute].autoIncrement;

    switch (attributeType) {
      case "STRING":
      case "TEXT":
        graphqlType = "String";
        break;
      case "INTEGER":
        graphqlType = "Int";
        break;
      case "FLOAT":
        graphqlType = "Float";
        break;
      case "BOOLEAN":
        graphqlType = "Boolean";
        break;
      default:
        graphqlType = "String"; // Default type
    }

    fields[attribute] = graphqlType;

    if (
      !isPrimaryKey &&
      !autoIncrement &&
      attribute !== "createdAt" &&
      attribute !== "updatedAt" &&
      attribute !== "deletedAt"
    ) {
      createInputFields[attribute] = `${graphqlType}${allowNull ? "" : "!"}`;
      updateInputFields[attribute] = graphqlType;
    }
  }

  const typeDef = `
type ${modelName} {
  ${Object.entries(fields)
    .map(([name, type]) => `${name}: ${type}`)
    .join("\n  ")}
}

input Create${modelName}Input {
  ${Object.entries(createInputFields)
    .map(([name, type]) => `${name}: ${type}`)
    .join("\n  ")}
}

input Update${modelName}Input {
  id: Int!
  ${Object.entries(updateInputFields)
    .map(([name, type]) => `${name}: ${type}`)
    .join("\n  ")}
}

type Query {
  ${modelName.toLowerCase()}(id: ID!): ${modelName}
  all${modelName}s: [${modelName}]
}

type Mutation {
  create${modelName}(input: Create${modelName}Input): ${modelName}
  update${modelName}(id: ID!, input: Update${modelName}Input): ${modelName}
  delete${modelName}(id: ID!): String
}
`;

  return typeDef;
};

// src/scripts/generateGraphQLSchemas.ts
const writeGraphQLSchemaToFile = (modelName: string, schema: string) => {
  const filePath = path.join(
    __dirname,
    `../graphql/schemass/${modelName}.graphql`
  );
  fs.writeFileSync(filePath, schema);
  // console.log(`GraphQL schema for ${modelName} written to ${filePath}`);
};

// Ensure the output directory exists
const outputDir = path.join(__dirname, "../graphql/schemass");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate and write schema for each model
Object.values(models).forEach(({ model }: { model: ModelCtor }) => {
  const schema = generateGraphQLSchema(model);
  writeGraphQLSchemaToFile(model.name, schema);
});

// src/scripts/generateResolvers.ts
const generateResolvers = (model: ModelCtor, filename: string) => {
  const modelName = model.name;
  const resolverTemplate = `
import { Transaction } from 'sequelize';
// import { AuthenticationError, BadRequestError } from 'apollo-server-errors';
import sequelize from '../../utils/db.connection'; 
import ${modelName} from '../../models/${filename.substring(
    0,
    filename.lastIndexOf(".")
  )}';

const ${modelName.toLowerCase()}Resolvers = {
  Query: {
    ${modelName.toLowerCase()}: async (_: any, { id }: { id: number }, ___: any) => {
      return await ${modelName}.findByPk(id);
    },
    all${modelName}s: async (_: any, __: any, ___: any) => {
      return await ${modelName}.findAll();
    },
  },

  Mutation: {
    create${modelName}: async (_: any, { input }: { input: any }, ___: any) => {
      let t: Transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED,
      });

      try {
        const result = await ${modelName}.create(input, { transaction: t });
        await t.commit();
        return result;
      } catch (error: any) {
        if (t) {
          await t.rollback();
        }
        throw new Error(\`\${error}\`);
      }
    },

    update${modelName}: async (_: any, { id, input }: { id: number, input: any }, ___: any) => {
      const instance = await ${modelName}.findByPk(id);
      if (!instance) {
        throw new Error('${modelName} not found');
      }
      await instance.update(input);
      return instance;
    },

    delete${modelName}: async (_: any, { id }: { id: number }, ___: any) => {
      const instance = await ${modelName}.findByPk(id);
      if (!instance) {
        throw new Error('${modelName} not found');
      }
      await instance.destroy();
      return 'Deleted';
    },
  },
};

export default ${modelName.toLowerCase()}Resolvers;
`;

  return resolverTemplate;
};

// src/scripts/generateResolvers.ts
const writeResolversToFile = (
  modelName: string,
  filename: string,
  resolvers: string
) => {
  const filePath = path.join(
    __dirname,
    `../graphql/resolverss/${filename.substring(
      0,
      filename.indexOf(".")
    )}_resolvers.ts`
  );
  fs.writeFileSync(filePath, resolvers);
  // console.log(`Resolver for ${modelName} written to ${filePath}`);
};

// Ensure the output directory exists
const outputDirResolvers = path.join(__dirname, "../graphql/resolverss");
if (!fs.existsSync(outputDirResolvers)) {
  fs.mkdirSync(outputDirResolvers, { recursive: true });
}

// Generate and write resolvers for each model
Object.values(models).forEach(
  ({ model, filename }: { model: ModelCtor; filename: string }) => {
    const resolvers = generateResolvers(model, filename);
    writeResolversToFile(model.name, filename, resolvers);
  }
);
