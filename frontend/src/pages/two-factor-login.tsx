import { Container } from "@/ui/components/container/container"

import { Layout } from "@/ui/components/layout/layout";
import { SettingsContainer } from "@/ui/components/settings/settings.container";
import TwoFactorLogin from "@/ui/components/two-factor-auth/two-factor-login";
import { Typography } from "@/ui/design-system/typography/typography";

export default function Settings() {
  return <TwoFactorLogin />;
}