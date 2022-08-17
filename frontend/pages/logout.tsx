import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export default function Logout() {
    const router = useRouter();
    useEffect(() => {
        localStorage.removeItem("Token");
        router.push("/login");
    })
    return (
        <div>
            <h1>Logging you out ...</h1>
        </div>
    );
}