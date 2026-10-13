export function validatePoeProducts(
  products: Array<{ slug: string; projectId: string; [key: string]: unknown }>,
  options: {
    tools: Array<{ projectId: string; assets?: Record<string, string>; manual?: Record<string, unknown> }>;
    imageExists: (relPath: string) => boolean;
  },
): string[];
