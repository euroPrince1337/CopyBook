import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../components/ui';
let url = process.env.NEXT_PUBLIC_URL

export default function Profile() {
    const router = useRouter();

    let [info, setInfo] = useState({});
    useEffect(() => {
        let token = localStorage.getItem("Token");
        let ps = async () => {
            setInfo(await fetch(`http://${url}/profile`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
        }
        ps().catch(console.error);
    }, [router.isReady]);
    return (
        <div>
            <Dashboard />
            <main className='flex flex-col place-items-center space-y-3'>
                <h1 className='text-2xl text-white'>{info["Username"]}</h1>
                <p>About me :</p>
                <p className='text-xl'>woops... </p>
            </main>
        </div>
    )
}