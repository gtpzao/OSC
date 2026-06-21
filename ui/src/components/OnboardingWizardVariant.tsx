import { OnboardingWizard } from "./OnboardingWizard";

/**
 * OSC ships the ORK onboarding flow as the default product experience.
 * Keeping the wrapper preserves existing imports while removing the upstream
 * experimental flag dependency from first-run onboarding.
 */
export function OnboardingWizardVariant() {
  return <OnboardingWizard />;
}
