# OSC Safety And Autonomous Mode

OSC ships with an aggressive local-first default so the bundled Software Factory Method can run without paid tokens or repeated approval prompts.

Default starter runtime:

- adapter: `claude_local`
- command: `fcc-claude`
- model path: `nvidia_nim/nvidia/nemotron-3-super-120b-a12b`
- `maxTurnsPerRun: 80`
- `dangerouslySkipPermissions: true`

That removes friction, but it also means the imported agents are ready to act with minimal operator interruption.

## Recommended operating model

- Use OSC on a local machine you control.
- Aim agents at a dedicated repo clone, branch, or worktree.
- Keep your production secrets out of the workspace unless the task actually needs them.
- Review generated diffs before merge, deploy, or release actions.
- Start with a narrow test repo before pointing the factory at a critical codebase.

## Git hygiene

- Prefer one disposable branch per active task stream.
- Keep `main` or `master` protected and merge only reviewed output.
- If agents need to run in parallel, give each one an isolated worktree.
- Treat generated commits like junior-engineer output: review, test, then accept.

## How to reduce autonomy

If the default runtime is too permissive for the target project, lower it before you run heartbeats:

- turn off `Skip permissions` in the adapter settings
- reduce `Max turns per run`
- lower heartbeat frequency
- reduce budgets per agent or project
- pause agents that should not run unattended

## Good first-run checklist

1. Start `fcc-server` and confirm the adapter test passes.
2. Let OSC auto-bootstrap the bundled factory, or open onboarding if you need a custom workspace/runtime first.
3. Point agents at a safe repo or sandbox workspace.
4. Create one small task and inspect the first run output.
5. Only then widen scope, budgets, or branch access.

## When not to use the default profile

Do not use the default autonomous profile unchanged when:

- the repo contains production credentials
- the branch is directly deployable
- the task can modify billing, auth, infra, or destructive data paths
- the workspace mixes unrelated client projects

In those cases, tighten permissions first and reduce the run budget before enabling heartbeats.
