import {
  SiCplusplus, SiPython, SiJavascript, SiTypescript, SiMysql,
  SiLangchain, SiHuggingface, SiNextdotjs, SiPostgresql, SiFirebase,
  SiMongodb, SiDocker, SiGit, SiGithub, SiVercel, SiFigma, SiLinux,
} from "react-icons/si";
import { FaJava, FaRobot, FaAws } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { Database, Network, ShieldCheck, Lock, Code2, Server, Globe, Binary } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "C++": SiCplusplus,
  "Java": FaJava,
  "Python": SiPython,
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "SQL": SiMysql,
  "RAG": Network,
  "LangChain": SiLangchain,
  "HuggingFace Transformers": SiHuggingface,
  "BioBERT": FaRobot,
  "Next.js": SiNextdotjs,
  "REST APIs": Network,
  "PostgreSQL": SiPostgresql,
  "Firebase Firestore": SiFirebase,
  "MongoDB": SiMongodb,
  "ChromaDB": Database,
  "Docker": SiDocker,
  "Seccomp / strace": SiLinux,
  "Row-Level Security (RLS)": ShieldCheck,
  "Zero-Trust Architecture": Lock,
  "Git": SiGit,
  "GitHub": SiGithub,
  "Vercel": SiVercel,
  "AWS (fundamentals)": FaAws,
  "Figma": SiFigma,
  "VS Code": VscVscode,
  "OOP": Code2,
  "OS": Server,
  "Computer Networks": Globe,
  "DBMS": Database,
  "DSA": Binary,
};

/** Compact skills: one row per category, chips inline. Lives inside the About section. */
export function SkillsStrip({ data = [] }: { data?: any[] }) {
  if (data.length === 0) return null;
  return (
    <div className="mt-10">
      <h3 className="mb-4 font-mono text-xs font-medium tracking-wide text-foreground-muted">
        skills
      </h3>
      <dl className="flex flex-col divide-y divide-black/[0.06] dark:divide-white/[0.06] border-y border-black/[0.06] dark:border-white/[0.06]">
        {data.map((group: any) => (
          <div
            key={group._id || group.category}
            className="grid grid-cols-1 gap-2 py-3.5 md:grid-cols-[150px_1fr] md:gap-6 md:items-baseline"
          >
            <dt className="font-mono text-xs uppercase tracking-[0.04em] text-foreground-subtle" title={group.usage || undefined}>
              {group.category}
            </dt>
            <dd className="flex flex-wrap gap-x-4 gap-y-1.5">
              {(group.skills || []).map((skill: any, i: number) => {
                const name = skill.name || skill;
                const Icon = iconMap[name] || iconMap[skill.iconString];
                return (
                  <span
                    key={`${name}-${i}`}
                    title={skill.context || undefined}
                    className="inline-flex items-center gap-1.5 text-small text-foreground-muted"
                  >
                    {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
                    {name}
                  </span>
                );
              })}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
