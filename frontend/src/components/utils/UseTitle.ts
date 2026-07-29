import { useEffect } from "react";

// Custom React Hook:
export function useTitle(title: string): void {
    useEffect(() => {
        document.title = title;
    }, []);
}
