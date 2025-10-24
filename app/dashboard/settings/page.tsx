import { Metadata } from "next";
import { SettingsContainer } from "./components/settings-container";

export const metadata: Metadata = {
  title: "Settings | CloudDojo",
  description: "Manage your account settings, subscription, and preferences.",
};

/**
 * Renders the account settings page.
 *
 * Displays the SettingsContainer component which provides controls for account settings, subscription, and preferences.
 *
 * @returns The React element representing the settings page.
 */
export default function SettingsPage() {
  return <SettingsContainer />;
}