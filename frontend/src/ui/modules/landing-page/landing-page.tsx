import { DataContext } from "@/pages/context";
import { Container } from "@/ui/components/container/container";
import { Button } from "@/ui/design-system/Button/button";
import { Typography } from "@/ui/design-system/typography/typography";
import Lottie from "lottie-react";
import { useContext, useState } from "react";
import { Si42 } from "react-icons/si";
import myLottie from "../../../../public/assets/lotties/Animation-pong.json";

export const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const path = `${process.env.NEXT_PUBLIC_URL}/auth/42`;
  return (
    <div className=" bg-gradient-to-r from-black to-accent-200 h-[80vh] flex items-center">
      <Container className="flex justify-between pt-40 pb-40 x-20 grow">
        <div className="w-[500px] h-[500px] self-center">
          <Lottie animationData={myLottie} loop={true} />
        </div>
        <div className="flex flex-col items-center space-y-20">
          <div className="space-y-16">
            <Typography variant="display" color="primary">
              Ping
            </Typography>
            <Typography
              variant="display"
              color="secondary"
              className="indent-10"
            >
              Pong
            </Typography>
          </div>
          <div>
            <Typography
              color="white"
              variant="h4"
              className="w-[536px] font-inter"
            >
              {" "}
              You wanna have fun?
              <br></br>What are you waiting for?! <b>Sign in</b> now and
              discover the ping pong game !
            </Typography>
          </div>
          <div>
            <Button
              variant="secondary"
              icon={{ Icon: Si42 }}
              iconPosition="left"
              iconTheme="primary"
              size="small"
              isLoading={isLoading}
              baseUrl={path}
              linkType="external"
            >
              <Typography variant="caption3" className="font-adamina">
                Log in via <b>Intra</b>
              </Typography>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};
