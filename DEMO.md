# DEMO SCRIPT (3 Minutes)

## 00:00 - 00:20: The Problem
*(Presenter stands center, screen displays the empty MissionForm UI with the blinking cursor.)*
**Presenter:** "It's Sunday morning. You have exactly 4 hours left in the hackathon. Your team is exhausted, the database won't sync, and everyone is refusing to cut their favorite features. You don't need a project manager. You need a machine that doesn't care about your feelings. You need MissionOS."

## 00:20 - 00:50: Repository Ingestion
*(Presenter types or clicks 'Load Demo Repository' to prefill a complex GitHub URL.)*
**Presenter:** "Instead of asking you what you *want* to do, MissionOS reads reality. We paste in our GitHub repository. The system instantly scrapes our open issues, PRs, and commit history."
*(Clicks 'Initiate Analysis'. The UI stages begin processing: Connecting... Reading... Analyzing...)*
**Presenter:** "It sends this raw evidence to Gemini 1.5 Flash to diagnose exactly why we are failing."

## 00:50 - 01:30: Mission Analysis
*(The UI resolves. The massive RED 96% failure probability hits the screen.)*
**Presenter:** "The diagnosis is brutal. Based on our evidence, Gemini mathematically proves we have a 96% chance of catastrophic failure. We need 120 hours of work, but only have 40 available. The math doesn't lie."

## 01:30 - 02:00: Strategy Recommendation
*(Presenter scrolls down to Strategy Cards.)*
**Presenter:** "Gemini doesn't just panic; it calculates survival paths. Here are three strategies. The AI recommends the 'Nuclear Core' strategy. It demands we immediately cut user authentication and the dark mode toggle. It's painful, but it drops our failure probability significantly."

## 02:00 - 02:40: Drift Detection
*(Presenter scrolls to the Milestone Timeline.)*
**Presenter:** "We accept the plan. We get back to work. But what happens when we inevitably mess up again? Milestone 1 was due on Day 1."
*(Presenter clicks the milestone and inputs Day 2.)*
**Presenter:** "We finished it, but we finished it late. Day 2."

## 02:40 - 03:00: Autonomous Renegotiation and Closing
*(The UI immediately flashes blue: REPLANNING IN PROGRESS. The timeline recalculates.)*
**Presenter:** "MissionOS detects the schedule drift. Without human intervention, it immediately calls Gemini to renegotiate the mission. It slashes another feature, adjusts the timeline, and gives us a new path to survival. This is autonomous, agentic triage. Thank you."

---

## Backup Demo Mode Flow
If the venue WiFi drops or API keys hit limits, do **NOT** panic.
1. Click the "Demo Mode" toggle in the bottom right corner of the screen.
2. The UI will turn the toggle blue.
3. Proceed with the exact script above. The application will use deterministic payloads and simulate network latency. The judges will not know the difference.

## Anticipated Judge Questions & Suggested Answers
**Q: "Why Gemini over GPT-4?"**
**A:** "Gemini 1.5 Flash was chosen specifically for its massive context window and rapid response time. When a project is burning, we need instant structured JSON output, not conversational text."

**Q: "How does it handle hallucinated data?"**
**A:** "We enforce a strict `SchemaType.OBJECT` on the Gemini payload at the API level. If the model hallucinates a bad schema, the server action catches it and recursively retries once before surfacing a graceful error."

## Common Failure Scenarios and Recovery
* **Blank Screen / Hydration Error:** Press `F5`. The `localStorage` persistence layer will instantly restore the exact state.
* **"Invalid GitHub URL":** Ensure you are pasting a standard `https://github.com/owner/repo` link without trailing subdirectories. Or simply use the "Load Demo Repository" shortcut.
