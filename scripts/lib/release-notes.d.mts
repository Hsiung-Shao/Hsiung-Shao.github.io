export interface ReleaseSection {
  title: string;
  items: string[];
}

export function splitReleaseSections(body: string | null | undefined): ReleaseSection[];
