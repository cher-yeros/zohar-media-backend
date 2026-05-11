import { Theme } from "../enums";

/** DB / Sequelize stores lowercase; GraphQL `Theme` enum uses LIGHT | DARK. */
export function themeToGraphQL(theme: string | Theme): "LIGHT" | "DARK" {
  const v = String(theme).toLowerCase();
  return v === Theme.DARK || v === "dark" ? "DARK" : "LIGHT";
}

export function themeFromGraphQL(theme: string): Theme {
  return String(theme).toUpperCase() === "DARK" ? Theme.DARK : Theme.LIGHT;
}
