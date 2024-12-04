import Link from "next/link"

import { Icons } from "@/components/ui/Icons"

export const MainNav = () => (
    <Link href="/" className="flex items-center space-x-2 md:pl-0 pl-2">
        <Icons.logo className="size-10" />
    </Link>
)
