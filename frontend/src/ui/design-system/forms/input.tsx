import clsx from "clsx";
import { Typography } from "../typography/typography";

interface Props {
    isLoading: boolean;
    placeholder?: string;
    type?: "text" | "email" | "password";
    register: any;
    value?: string;
    errors: any;
    errorMsg?: string;
    id: string;
    required?: boolean;
    isAutocompleted?: boolean;
}

export const Input = ({
    isLoading,
    placeholder,
    value,
    type = "text",
    register,
    errors,
    errorMsg,
    id,
    required = true,
    isAutocompleted,
}: Props) => {
    return (
        <div className="space-y-2">
            <input type={type} 
                        placeholder={placeholder}
                        className={clsx(isLoading && "cursor-not-allowed", errors[id]? "placeholder-red-500" : "placeholder-gray-600" , "w-full p-4 font-light border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-secondary")} 
                        disabled={isLoading}
                        {...register(id, {required: {value: required, message: errorMsg}})}
                        autoComplete={isAutocompleted? "on" : "off"}
                        value={value}
                        />
            {errors[id] && (<Typography variant="caption4" className="text-red-500">{errors[id]?.message}</Typography>)}
        </div>
    );
};