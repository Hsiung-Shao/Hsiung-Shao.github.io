export function validateProducts(
  // 檢查的對象就是可能缺欄位的 JSON,所以接受任意形狀
  products: unknown[],
  options: {
    tools: Array<{ projectId: string; assets?: Record<string, string>; manual?: Record<string, unknown> }>;
    projects: Array<{ id: string }>;
    imageExists: (relPath: string) => boolean;
  },
): string[];
