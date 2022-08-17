import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../../components/ui';


export default function Profile() {
    const router = useRouter();

    let [info, setInfo] = useState({});
    useEffect(() => {
        if (!router.isReady) return;
        let token = localStorage.getItem("Token");
        let ps = async () => {
            const { pid } = router.query
            setInfo(await fetch(`http://127.0.0.1:3000/profile/${pid}`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
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