export const DATA_FILES: string[];
export function pullData(options: {
  run: (cmd: string, args: string[]) => string;
  fs: { existsSync: (path: string) => boolean; writeFileSync: (path: string, content: string) => void };
  env: Record<string, string | undefined>;
  dataDir: string;
}): { status: 'pulled' | 'kept' | 'skipped'; warning?: string };
