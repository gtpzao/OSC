export const FCC_WINDOWS_INSTALL_COMMAND =
  'irm "https://github.com/Alishahryar1/free-claude-code/blob/main/scripts/install.ps1?raw=1" | iex';

function commandLooksLike(command: string, expected: string): boolean {
  const normalized = command.trim().toLowerCase().replaceAll("/", "\\");
  return normalized.endsWith(`\\${expected}`) || normalized === expected;
}

export function isFccClaudeCommand(command: string): boolean {
  return (
    commandLooksLike(command, "fcc-claude") ||
    commandLooksLike(command, "fcc-claude.cmd") ||
    commandLooksLike(command, "fcc-claude.exe")
  );
}
