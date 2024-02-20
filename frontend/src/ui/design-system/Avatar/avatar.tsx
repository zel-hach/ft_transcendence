import Image from "next/image";
import clsx from "clsx";

interface Props{
    size?: "small" | "medium" | "large";
    src: string;
    alt: string;
}

export const Avatar = ({size = "medium", src, alt}: Props) => {
    let avatarStyle: string;

    switch(size)
    {
        case "small":
            avatarStyle = "w-24 h-24";
            break;
        case "medium":
            avatarStyle = "w-[34px] h-[34px]";
            break;
        case "large":
            avatarStyle = "w-[50px] h-[50px]";
            break;
    }
    return (
        <div className={clsx(avatarStyle, "bg-white relative rounded-full")}>
            <Image fill src={src} alt={alt} className="object-cover object-center rounded-full"/>
        </div>
    )
}