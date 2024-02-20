import { IconProps } from "@/types/iconProps";
import { ActiveLink } from "@/ui/components/navigation/active-link";
import clsx from "clsx";
import { Spinner } from "../spinner/spinner";

interface props {
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "ico" | "disabled";
  icon?: IconProps;
  iconTheme?: "primary" | "secondary" | "black";
  iconPosition?: "left" | "right";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  baseUrl?: string;
  linkType?: string;
  action?: Function;
  type?: "button" | "submit";
  children?: React.ReactNode;
}

export const Button = ({
  size = "medium",
  variant = "secondary",
  icon,
  iconTheme,
  iconPosition,
  isLoading,
  disabled,
  className,
  baseUrl,
  linkType = "internal",
  type = "button",
  action = () => {},
  children,
}: props) => {
  let variantStyle: string = "",
    sizeStyle: string = "",
    iconSize: number = 0;

  switch (variant) {
    case "primary":
      variantStyle =
        "bg-primary-200 hover:bg-primary/50 text-black rounded border border-accent";
      break;
    case "secondary":
      variantStyle = "bg-secondary hover:bg-secondary-300 text-black rounded";
      break;
    case "disabled":
      variantStyle = "bg-gray-400 text-gray-600 rounded";
    case "ico":
      if (iconTheme === "primary") {
        variantStyle =
          "bg-black/80 hover:text-primary/100 text-primary/50 rounded-full";
      }
      if (iconTheme === "black") {
        variantStyle =
          "bg-secondary hover:bg-primary/50 text-black rounded-full";
      }
      if (iconTheme == "secondary") {
        variantStyle =
          "bg-black hover:text-secondary-200 text-secondary rounded-full";
      }
      break;
  }
  switch (size) {
    case "small":
      sizeStyle = `${
        variant === "ico"
          ? "flex items-center justify-center w-[50px] h-[50px]"
          : "py-[15px] px-[20px]"
      }`;
      iconSize = 18;
      break;
    case "medium":
      sizeStyle = `${
        variant === "ico"
          ? "flex items-center justify-center w-[70px] h-[70px]"
          : "py-[25px] px-[45px]"
      }`;
      iconSize = 25;
      break;
  }

  const handleClick = () => {
    if (action) {
      action();
    }
  };

  const buttonContent = (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          {variant == "secondary" || variant == "ico" ? (
            <Spinner size="small" variant="black" />
          ) : (
            <Spinner size="small" />
          )}
        </div>
      )}
      <div className={clsx(isLoading && "invisible")}>
        {icon && variant === "ico" ? (
          <icon.Icon size={iconSize} />
        ) : (
          <div className={clsx(icon && "flex items-center gap-2")}>
            {icon && iconPosition === "left" && <icon.Icon size={iconSize} />}
            {children}
            {icon && iconPosition === "right" && <icon.Icon size={iconSize} />}
          </div>
        )}
      </div>
    </>
  );

  const buttonElement = (
    <button
      type={type}
      className={clsx(
        variantStyle,
        className,
        sizeStyle,
        iconSize,
        isLoading && "cursor-not-allowed",
        "relative"
      )}
      onClick={handleClick}
      disabled={disabled || isLoading ? true : false}
    >
      {buttonContent}
    </button>
  );
  if (baseUrl) {
    if (linkType === "external") {
      return <a href={baseUrl}>{buttonElement}</a>;
    } else return <ActiveLink href={baseUrl}>{buttonElement}</ActiveLink>;
  }
  return buttonElement;
};
