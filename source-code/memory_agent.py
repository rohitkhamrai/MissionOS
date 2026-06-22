import os
import sys
import json
import urllib.request
import urllib.error
import subprocess

def load_dotenv(dotenv_path=".env"):
    if os.path.exists(dotenv_path):
        with open(dotenv_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ[key.strip()] = val.strip().strip('"').strip("'")

def get_git_info():
    try:
        commit_msg = subprocess.check_output(
            ["git", "log", "-n", "1", "--pretty=format:%B"], 
            stderr=subprocess.DEVNULL
        ).decode("utf-8", errors="ignore").strip()
        git_diff = subprocess.check_output(
            ["git", "diff", "HEAD~1", "HEAD"], 
            stderr=subprocess.DEVNULL
        ).decode("utf-8", errors="ignore").strip()
        return commit_msg, git_diff
    except Exception:
        return "", ""

def get_latest_summary():
    try:
        summary_files = []
        for root, dirs, files in os.walk(".planning"):
            for file in files:
                if file.endswith("-SUMMARY.md"):
                    summary_files.append(os.path.join(root, file))
        if not summary_files:
            return ""
        # Sort by filename or modification time
        summary_files.sort(key=os.path.getmtime)
        latest_file = summary_files[-1]
        with open(latest_file, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        print(f"Error finding latest summary: {e}")
        return ""

def read_brain_files():
    brain_dir = "brain"
    files = [
        "master-memory.md", "memory.md", "architecture.md", 
        "patterns.md", "decisions.md", "mistakes.md", 
        "roadmap.md", "glossary.md"
    ]
    contents = {}
    for filename in files:
        path = os.path.join(brain_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                contents[filename] = f.read()
        else:
            contents[filename] = ""
    return contents

def run_openrouter_update(api_key, brain_contents, commit_msg, git_diff, latest_summary):
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/open-gsd/gsd-core",
        "X-Title": "Project Brain Memory Agent"
    }
    
    prompt = f"""You are the Memory Agent for Project Brain.
Your role is to update the persistent memory files in the 'brain/' directory based on the latest development activity.

Here are the current contents of the memory files:
=== brain/master-memory.md ===
{brain_contents.get('master-memory.md', '')}

=== brain/memory.md ===
{brain_contents.get('memory.md', '')}

=== brain/architecture.md ===
{brain_contents.get('architecture.md', '')}

=== brain/patterns.md ===
{brain_contents.get('patterns.md', '')}

=== brain/decisions.md ===
{brain_contents.get('decisions.md', '')}

=== brain/mistakes.md ===
{brain_contents.get('mistakes.md', '')}

=== brain/roadmap.md ===
{brain_contents.get('roadmap.md', '')}

=== brain/glossary.md ===
{brain_contents.get('glossary.md', '')}

Here is the latest development activity details:
- Latest commit message: {commit_msg}
- Latest git diff:
{git_diff}
- Latest task summary:
{latest_summary}

Based on this activity, update the relevant brain files. Ensure:
1. Any new decisions made are appended to the decisions log in brain/decisions.md.
2. Any new patterns established are added to brain/patterns.md.
3. Any mistakes, warnings, or pitfalls encountered are added to brain/mistakes.md.
4. General status and active work is updated in brain/memory.md.
5. brain/master-memory.md is regenerated as a highly compressed summary of all files, and MUST stay under 5,000 words limit.
6. Leave other files (architecture.md, roadmap.md, glossary.md) unchanged unless the activity explicitly updates them.

Return your response ONLY as a valid JSON object matching the following structure (do not wrap in markdown code fences, do not output any other text):
{{
  "master-memory.md": "updated content...",
  "memory.md": "updated content...",
  "patterns.md": "updated content...",
  "decisions.md": "updated content...",
  "mistakes.md": "updated content..."
}}
"""
    
    data = {
        "model": "meta-llama/llama-3-8b-instruct:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"), headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode("utf-8"))
            content = res_data["choices"][0]["message"]["content"].strip()
            # If wrapped in code block, extract
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:].strip()
                content = content.strip("`").strip()
            return json.loads(content)
    except urllib.error.HTTPError as e:
        print(f"OpenRouter API HTTP Error: {e.code} - {e.read().decode('utf-8')}")
        return None
    except Exception as e:
        print(f"Error querying OpenRouter API: {e}")
        return None

def main():
    load_dotenv()
    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("Warning: OPENROUTER_API_KEY environment variable not set. Skipping automated memory update.")
        sys.exit(0)
        
    print("Memory Agent: Reading repository state...")
    commit_msg, git_diff = get_git_info()
    latest_summary = get_latest_summary()
    brain_contents = read_brain_files()
    
    print("Memory Agent: Updating memory files via OpenRouter...")
    updates = run_openrouter_update(api_key, brain_contents, commit_msg, git_diff, latest_summary)
    
    if updates:
        for filename, new_content in updates.items():
            path = os.path.join("brain", filename)
            with open(path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"✓ Updated brain/{filename}")
        print("Memory Agent complete.")
    else:
        print("Memory Agent: Failed to update memory files.")

if __name__ == "__main__":
    main()
