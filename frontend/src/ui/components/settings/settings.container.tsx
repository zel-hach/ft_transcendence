import { Container } from "../container/container";
import { SettingsView } from "./settings.view";

export const SettingsContainer = () => {
  return (
    <>
      <Container className=" border-cyan-400 flex justify-center">
        <SettingsView />
      </Container>
    </>
  );
};
