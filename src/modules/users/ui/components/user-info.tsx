import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@/components/ui/tooltip";

const userInfoVaraints = cva("flex items-center gap-1", {
    variants: {
        size: {
            default: "[&_p]:text-sm [&_svg]:size-4",
            lg: "[&_p]:text-base [&_svg]:size-5 [&_p]:font-medium [&_p]:teext-black",
            sm: "[&_p]:text-xs [&_svg]:size-3.5",
        }
    },
    defaultVariants: {
        size: "default"
    }
});

interface UserInfoProps extends VariantProps<typeof userInfoVaraints> {
    name: string;
    className?: string;
};

export const UserInfo = ({
    name,
    className,
    size
}: UserInfoProps) => {
    return (
        <div className={cn(userInfoVaraints({ size, className }))}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className="text-gray-800 hover:text-gray-800 line-clamp-1">
                        {name}
                    </p>
                </TooltipTrigger>
                <TooltipContent align="center" className="bg-black/70">
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};