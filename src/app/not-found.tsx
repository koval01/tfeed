"use client";

import { useRouter } from "next/navigation";
import { Error } from "@/components/Error";

export default function NotFound() {
    const router = useRouter();

    return (
        <Error header="Not Found" description="Could not find requested resource" actions={{
            click: () => router.push("/"), name: "Go to home"
        }} />
    )
}
