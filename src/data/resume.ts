import rawResume from './resume.json';
import poeTools from './poe-tools.json';
import { projects, type Project } from './projects';

interface ResumeExperience {
  company: string;
  industry: string;
  role: string;
  period: string | null;
  summary: string;
  highlights: string[];
  tech: string[];
}

interface ResumeProjectRef {
  id: string;
  note: string;
  metric?: { tool: string; key: string; label: string };
}

interface Resume {
  name: string;
  nameEn: string;
  headline: string;
  location: string;
  summary: string[];
  contact: { label: string; value: string; href: string }[];
  experience: ResumeExperience[];
  projects: ResumeProjectRef[];
  otherProjects: string[];
  skills: { label: string; items: string[] }[];
  education: { school: string; department: string; degree: string; period: string }[];
}

export const resume = rawResume as Resume;

// 專案的標題、技術與連結從 projects.json 取,履歷只補一句成果,兩邊才不會各寫各的。
// 找不到 id 就讓建置失敗(validate-content 也會先擋)。
function findProject(id: string): Project {
  const project = projects.find(candidate => candidate.id === id);
  if (!project) throw new Error(`resume.json: 找不到專案 ${id}`);
  return project;
}

// 數字只取 poe-tools.json 裡有 asOf 的手動值,沒有就不顯示,不在履歷裡另寫一份。
function readMetric(metric: ResumeProjectRef['metric']) {
  if (!metric) return null;
  const tool = poeTools.tools.find(candidate => candidate.projectId === metric.tool);
  const entry = (tool?.manual as Record<string, { value: number | null; asOf: string }> | undefined)?.[metric.key];
  if (!entry || entry.value === null) return null;
  return { label: metric.label, value: entry.value.toLocaleString('zh-TW'), asOf: entry.asOf };
}

export const resumeProjects = resume.projects.map(ref => ({
  project: findProject(ref.id),
  note: ref.note,
  metric: readMetric(ref.metric),
}));

export const otherResumeProjects = resume.otherProjects.map(findProject);
