# Architecture Overview

## High-Level Architecture
MissionOS uses a Serverless Next.js architecture, leaning heavily on Next.js App Router and Server Actions. This creates a secure, fast, and highly reliable pipeline where API keys are strictly sandboxed on the server, while the client maintains an instantaneous, rich interaction model.

## Component Interactions
1. **`app/page.tsx`**: The orchestrator. Manages the core mission state, synchronizes with `localStorage`, and handles the global Demo Mode context.
2. **`components/MissionForm.tsx`**: The intake boundary. Scrapes external APIs (GitHub), manages loading states, and dispatches the payload to the server.
3. **`lib/gemini.ts`**: The AI Brain. Defines the exact JSON schema required by the UI, communicates with the Gemini 1.5 Flash model, and sanitizes/parses the output.

## GitHub Evidence Ingestion Flow
1. Client parses the GitHub URL (`https://github.com/owner/repo`).
2. Client queries GitHub's public REST APIs (`/repos/{owner}/{repo}` and `/repos/{owner}/{repo}/issues`).
3. Evidence is compiled into a lightweight markdown string.
4. Payload is submitted along with the user's optional manual mission description.

## Gemini Workflow
1. `lib/gemini.ts` receives the payload.
2. The system dynamically adjusts the prompt based on whether it is an initial analysis or a renegotiation.
3. The prompt explicitly forces the `gemini-1.5-flash` model to adhere to the `responseSchema` (defined using `SchemaType.OBJECT`).
4. The response text is scrubbed of markdown code blocks and parsed into a strict `MissionAnalysis` TypeScript interface.

## Renegotiation Lifecycle
1. The user interacts with the `MilestoneTimeline.tsx` component, marking a milestone complete.
2. If the user marks the milestone complete *after* the expected day, a "Drift" is detected.
3. The UI automatically triggers `handleDrift` in `page.tsx`.
4. The client dispatches a specialized `RenegotiationInput` object to `lib/gemini.ts`.
5. The Gemini model re-evaluates the entire mission, slashing additional scope, and returns a completely new `MissionAnalysis` object.
6. The state updates, rendering the new, narrower path forward.

## Persistence Architecture
To avoid the complexity of an external database, the system uses React's `useEffect` to synchronize the active `MissionAnalysis` object, the `LogEntry[]` array, and the `isDemoMode` boolean to the browser's `localStorage`. This guarantees survival across browser refreshes and accidental tab closures.

## Error Recovery
* **Network / Rate Limits**: GitHub API 403s and 404s are caught at the edge and translated into human-readable UI prompts.
* **Gemini Hallucinations**: If the Gemini model returns malformed JSON, the `lib/gemini.ts` action catches the `SyntaxError`, logs a warning, and performs exactly one recursive retry.
* **Render Safety**: The UI components expect exactly what the TypeScript interface defines. Missing data is caught by React Error Boundaries (or defaults to empty arrays) preventing catastrophic White Screen of Death (WSOD).

## Demo Mode Architecture
The system includes `lib/mock.ts`, a file containing deterministic, pre-computed JSON payloads identical to production Gemini responses.
When Demo Mode is toggled via the developer panel:
1. Network requests to GitHub are bypassed.
2. Network requests to Gemini are bypassed.
3. `setTimeout` is used to simulate realistic pipeline latency (500ms - 1200ms per stage).
4. The UI processes the mock payload exactly as it would production data, guaranteeing a flawless live presentation.
