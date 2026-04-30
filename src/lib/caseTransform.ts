function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function convertCamelToSnake(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertCamelToSnake);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        toSnakeCase(k),
        convertCamelToSnake(v),
      ]),
    );
  }
  return obj;
}

export function convertSnakeToCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(convertSnakeToCamel);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        toCamelCase(k),
        convertSnakeToCamel(v),
      ]),
    );
  }
  return obj;
}
