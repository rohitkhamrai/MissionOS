"use client";

import React, { useState } from "react";
import type { MissionAnalysis, InitialMissionInput } from "@/types/mission";
import { analyzeMission } from "@/lib/gemini";
import { getMockMission, simulateLatency } from "@/lib/mock";

const DEMO_REPOS = [
  { url: "https://github.com/facebook/react", desc: "Migrate the entire core architecture to Server Components by the end of Q3 without breaking backward compatibility." },
  { url: "https://github.com/vercel/next.js", desc: "Ship Turbopack support for all experimental Next.js 15 features before the annual conference." },
  { url: "https://github.com/twbs/bootstrap", desc: "Completely rewrite the grid system using CSS Grid and drop all Sass mixin backwards compatibility in v6." }
];

function MissionForm({ 
  onAnalyze,
  onLog,
  isDemoMode,
  onLoadingChange
}: { 
  onAnalyze: (data: MissionAnalysis) => void;
  onLog: (text: string, type?: 'success'|'warning'|'error') => void;
  isDemoMode: boolean;
  onLoadingChange?: (loading: boolean) => void;
}) {
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [demoIndex, setDemoIndex] = useState(0);

  function normalizeGithubUrl(url: string) {
    if (!url) return null;
    const clean = url.trim().replace(/\.git\/?$/, "").replace(/\/$/, "");
    if (clean.includes("github.com")) {
      const match = clean.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) return { owner: match[1], repo: match[2] };
    }
    return null;
  }

  const loadDemoRepo = () => {
    setGithubUrl(DEMO_REPOS[demoIndex].url);
    setDescription(DEMO_REPOS[demoIndex].desc);
    setDemoIndex((demoIndex + 1) % DEMO_REPOS.length);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim() && !githubUrl.trim()) return;

    if (onLoadingChange) onLoadingChange(true);
    setLoadingStatus("Initializing protocol...");
    setError(null);
    onLog("Initiating intake protocol...", "success");

    if (isDemoMode) {
      try {
        setLoadingStatus("Building mission plan...");
        const mockMission = getMockMission(githubUrl);
        const newMission = await simulateLatency(mockMission, 600, 1200);
        onAnalyze(newMission);
      } catch {
        setError("Demo mode simulation failed.");
        onLog("Demo mode simulation failed", "error");
      } finally {
        setLoadingStatus(null);
      }
      return;
    }

    try {
      let githubData = "";
      
      const repoDetails = normalizeGithubUrl(githubUrl);
      if (repoDetails) {
        const { owner, repo } = repoDetails;
        setLoadingStatus("Connecting to GitHub...");
        onLog(`Connecting to GitHub API for ${owner}/${repo}...`, "success");
        
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (repoRes.status === 403 || repoRes.status === 429) {
          throw new Error("GitHub API rate limit exceeded. Please wait or use Demo Mode.");
        } else if (repoRes.status === 404) {
          throw new Error("GitHub repository not found. Please verify the URL.");
        } else if (!repoRes.ok) {
          throw new Error(`GitHub API error (${repoRes.status}).`);
        }

        setLoadingStatus("Reading repository...");
        const rData = await repoRes.json();
        onLog(`Parsed repository metadata: ${rData.language || 'Unknown'} codebase, ${rData.stargazers_count} stars`, "success");
        
        setLoadingStatus("Extracting evidence...");
        const issuesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?per_page=10&state=open`);
        let issuesText = "";
        if (issuesRes.ok) {
           const iData = await issuesRes.json();
           issuesText = iData.map((i: { state: string; title: string }) => `- [${i.state}] ${i.title}`).join("\n");
           onLog(`Identified ${rData.open_issues_count} open issues (${iData.length} analyzed)`, "success");
        }
        
        githubData = `Repository: ${rData.full_name}\nDescription: ${rData.description}\nLanguage: ${rData.language}\nOpen Issues Count: ${rData.open_issues_count}\nRecent Open Issues/PRs:\n${issuesText}`;
      } else if (githubUrl.trim()) {
        throw new Error("Invalid GitHub URL format. Example: https://github.com/owner/repo");
      }

      setLoadingStatus("Analyzing constraints...");
      onLog("Transmitting evidence to Gemini for analysis...", "success");
      
      const inputPayload: InitialMissionInput = {
        description: description.trim(),
        githubData: githubData || undefined,
      };
      
      setLoadingStatus("Generating strategies...");
      const response = await analyzeMission(inputPayload);
      onLog("Generated recovery strategies and timeline", "success");
      
      setLoadingStatus("Building mission plan...");
      onAnalyze(response);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Analysis failure";
      onLog(`Mission generation failed: ${errorMessage}`, "error");
      setError(errorMessage);
    } finally {
      setLoadingStatus(null);
      if (onLoadingChange) onLoadingChange(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="relative group">
          <div className="relative bg-[#0a0a0a] border border-white/5 p-6 md:p-8 rounded-lg transition-colors duration-300 flex flex-col gap-6">
            
            <div className="flex flex-col gap-2">
              <label htmlFor="githubUrl" className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold font-mono">External Evidence Source (Optional)</label>
              <input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="w-full bg-[#050505] border border-white/5 p-3 rounded text-gray-200 font-mono focus:border-blue-500/30 focus:outline-none transition-colors duration-200 text-xs tracking-widest placeholder:text-gray-700"
                disabled={!!loadingStatus}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="text-[10px] uppercase tracking-[0.2em] text-blue-500 font-bold font-mono">Mission Description (Optional if URL provided)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Define mission parameters..."
                className="w-full bg-[#050505] border border-white/5 p-4 rounded text-gray-300 font-sans focus:border-blue-500/30 focus:outline-none transition-colors duration-200 resize-none text-sm md:text-base leading-relaxed placeholder:text-gray-700"
                rows={4}
                disabled={!!loadingStatus}
              />
            </div>

          </div>
        </div>

        <div className="flex flex-col items-center mt-2 gap-4">
          <button
            type="submit"
            className="group relative px-10 py-4 bg-transparent overflow-hidden rounded border border-white/5 hover:border-blue-500/50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto min-w-[300px]"
            disabled={!!loadingStatus || (!description.trim() && !githubUrl.trim())}
          >
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors duration-300"></div>
            <span className="relative text-blue-400 group-hover:text-blue-300 font-bold tracking-[0.2em] uppercase text-xs md:text-sm font-mono">
              {loadingStatus ? (
                <span className="animate-pulse">{loadingStatus}</span>
              ) : error ? (
                "Retry Analysis"
              ) : (
                "Initiate Analysis"
              )}
            </span>
          </button>
          
          <button 
            type="button"
            onClick={loadDemoRepo}
            disabled={!!loadingStatus}
            className="text-[10px] text-gray-500 hover:text-gray-300 uppercase tracking-[0.2em] underline underline-offset-4 decoration-white/10 transition-colors font-mono"
          >
            Load Demo Repository
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-8 p-4 bg-red-950/30 border border-white/5 text-red-400 font-sans text-sm md:text-base text-center rounded transition-opacity duration-300">
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default React.memo(MissionForm);
