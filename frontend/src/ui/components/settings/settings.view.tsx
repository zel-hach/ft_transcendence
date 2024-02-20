import { Typography } from "@/ui/design-system/typography/typography";
import { Container } from "../container/container";
import { SettingsForm } from "./settings.form";

export const SettingsView = () => {
  return (
    <Container className="bg-gray flex flex-col justify-center items-center gap-12 w-full rounded p-4 md:p-8 lg:p-12">
      <Typography variant="h4" component="h1" className="mb-6 text-primary">
        My Account
      </Typography>
      <SettingsForm />
    </Container>
  );
};
