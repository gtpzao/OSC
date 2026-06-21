// @vitest-environment jsdom

import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OnboardingWizardVariant } from "./OnboardingWizardVariant";

// The wrapper only decides which wizard to mount, so stub the heavy child.
vi.mock("./OnboardingWizard", () => ({
  OnboardingWizard: () => <div data-testid="wizard-capsule" />,
}));

async function flushReact() {
  for (let index = 0; index < 5; index += 1) {
    await Promise.resolve();
    await new Promise((resolve) => window.setTimeout(resolve, 0));
  }
  flushSync(() => {});
}

describe("OnboardingWizardVariant", () => {
  let container: HTMLDivElement;
  let root: Root | null = null;

  async function renderVariant() {
    root = createRoot(container);
    flushSync(() => {
      root!.render(<OnboardingWizardVariant />);
    });
    await flushReact();
  }

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    flushSync(() => {
      root?.unmount();
    });
    root = null;
    container.remove();
  });

  it("renders the ORK onboarding wizard by default", async () => {
    await renderVariant();

    expect(container.querySelector('[data-testid="wizard-capsule"]')).not.toBeNull();
  });
});
