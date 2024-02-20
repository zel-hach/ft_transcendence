import { Typography } from "@/ui/design-system/typography/typography"
import { Container } from "../container/container"

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return(
            <div className="px-20 py-8 bg-black">
                <Container className="flex flex-col items-center space-y-5">
                    <Typography variant="lead" color="primary" className="font-adamina">About game</Typography>
                    <Typography variant="body-lg" color="white" component="p" className="w-[700px] text-center font-adamina"> Ping Pong  commonly known as tennis table, 
                        is a game in which two or four players hit a light hollow ball back and forth across a 
                        net stretched across the center of a table.</Typography>
                    {/* <Typography variant="lead" color="white" component="p" className="text-center font-adamina"> Ping Pong  commonly known as tennis table, 
                        is a game in which two or four players hit a light hollow ball back and forth across a 
                        net stretched across the center of a table.</Typography> */}
                    <Container className="flex justify-between">
                        <Typography variant="caption3" color="primary" >ft_transcendence</Typography>
                        <Typography variant="caption3" color="primary">{`Copyright © ${currentYear} | 1337`}</Typography>
                    </Container>        
                </Container>
            </div>
    )
}