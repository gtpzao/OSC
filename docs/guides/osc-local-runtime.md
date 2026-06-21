# OSC Local Runtime

OSC App is configured to treat the following path as the default local runtime:

- adapter type: `claude_local`
- command: `fcc-claude`
- model: `nvidia_nim/nvidia/nemotron-3-super-120b-a12b`

## Intended flow

1. Start `fcc-server` on the host machine.
2. Open the FCC Admin UI.
3. Set `NVIDIA_NIM_API_KEY`.
4. Keep the default model or switch to another NVIDIA NIM-compatible free path.
5. Start OSC locally; the first empty boot auto-imports the bundled Software Factory Method.
6. Open ORK onboarding when you want to point the factory at a target repo/workspace, create another factory, or adjust runtime defaults.
7. Use `Test now` before saving onboarding changes.
8. The `claude_local` probe now runs against `fcc-claude` directly, so it fails fast when the FCC launcher, the underlying `claude` binary, or the local FCC proxy is unavailable.
9. If `fcc-claude` is not on `PATH`, install or update it on Windows with `irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1" | iex`, or set the `Command` field to the absolute executable path.
10. Use `Extra args (comma-separated)` only for trailing CLI flags that should be appended after Paperclip's managed Claude arguments.

## Runtime defaults applied by the starter

- non-interactive local adapter: `claude_local`
- command path: `fcc-claude`
- autonomous turn budget: `maxTurnsPerRun: 80`
- permission skipping: `dangerouslySkipPermissions: true`

These defaults are chosen so a first local install can run without paid hosted tokens or manual approval prompts on every heartbeat.

## Why this is the default

The goal is to keep Paperclip's local orchestration model while removing the immediate requirement for paid Anthropic or OpenAI API access.

## Starter company

The bundled starter company lives at:

- `starter-companies/software-factory-method`

When onboarding installs or updates an ORK factory, OSC applies the runtime chosen there across every imported agent in that starter company.
On the very first empty local boot, OSC imports this starter automatically with the bundled FCC + NVIDIA NIM defaults.

After the factory installs, OSC can open a starter `BMAD Launchpad` project and issue so the lead agent has an immediate first task.

## Safety notes

- Run the default stack on a local machine you control.
- Point agents at disposable branches or worktrees instead of your primary branch.
- Lower permissions or max turns if you want more operator review between heartbeats.

See [OSC safety and autonomous mode](./osc-safety.md) for the full checklist.
