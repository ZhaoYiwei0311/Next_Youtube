import Link from 'next/link';
import { SidebarTrigger } from "@/components/ui/sidebar"
import Image from 'next/image';
import { SearchInput } from "./search-input";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";

export const HomeNavBar = () => {


    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
            {/* Menu and Logo */}
            <div className="flex items-center flex-shrink-0">
                <SidebarTrigger />
                <Link href="/">
                    <div className='p-4 flex items-center gap-1'>
                        <Image src="/logo.svg" height={32} width={32} alt="Logo" />
                        <p className='text-xl fonr-semibold tracking-tight'>NewTube</p>
                    </div>
                </Link>
            </div>

            {/* Search bar */}
            <div className='flex-1 flex justify-center max-w-[720px] mx-auto'>
                <SearchInput />
            </div>

            <div className='flex-shrink-0 items-center flex gap-4'>
                <AuthButton />
            </div>
        </nav>
    )
};