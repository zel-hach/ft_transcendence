import Image from "next/image";
import plogo from "../../../../public/assets/images/f-logo.png";
interface Props{
    size?: "very small" | "small" | "medium" | "large";
}

export const Logo = ({size = "medium"}: Props) => {
    let logoSize: number;

    switch(size)
    {
        case "very small":
            logoSize = 34;
            break;
        case "small":
            logoSize = 61;
            break;
        case "medium":
            logoSize = 88;
            break;
        case "large":
            logoSize = 144;
            break;
    }
    return (
    <div>
        <Image width={logoSize} alt="pong logo" src={plogo}/>
    </div>
    )
}