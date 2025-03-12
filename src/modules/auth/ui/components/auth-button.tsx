import { UserCircle2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

export const AuthButton = () => {
    // TODO: Add different auth states
    return (
        <Button
            variant="outline"
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border-blue-500/2 rounded-full shadow-none []">
            <UserCircle2Icon />
            Sign in
        </Button>
    );
};