import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

interface Props{
    size?: "small" | "medium" | "large";
    variant?: "secondary" | "primary" | "black";
}

export const Spinner = ({size = "small", variant="primary"}:Props) => {

    let sizeStyle : string = "";
    let variantStyle: string = "";

    switch(size)
    {
        case "small":
            sizeStyle = "w-5 h-5";
            break;
        case "medium":
            sizeStyle = "w-9 h-9";
            break;
        case "large":
            sizeStyle = "w-12 h-12";
            break;
    }

   switch(variant)
    {
        case "secondary":
            variantStyle = "text-secondary";
            break;
        case "primary":
            variantStyle = "text-primary";
             break;
        case "black":
            variantStyle = "text-black";
            break;
    }
    return(
    <>
        <CgSpinner className={clsx(sizeStyle, variantStyle, "animate-spin")}/>
    </>
    )
}