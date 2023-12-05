import { useEffect, useState } from "react";

export function useIsMounted() {
    const [mounted, setMounted] = useState<Boolean>(false); 

    useEffect(() => {
        setMounted(true);
    }, [])

    return mounted;
}