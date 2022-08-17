import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link'
let url = process.env.NEXT_PUBLIC_URL

export default function Login() {
    const router = useRouter();

    useEffect(() => {
        let stuff = localStorage.getItem("Token");
        if (stuff != null) {
            router.push("/")
        }
    }, []);

    let grab_token = async (event) => {
        event.preventDefault();
        let username = (document.getElementById("Username") as HTMLInputElement).value;
        let password = (document.getElementById("Password") as HTMLInputElement).value;

        let token = await fetch(`http://${url}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, mode: "cors", body: JSON.stringify({ "username": username, "pass": password }) }).then(r => r.json());
        if (token["status"] == "ok") {
            await localStorage.setItem("Token", token["text"]);
            router.push('/')
        }
        else {
            alert("bad username/password");
        }
    }



    return (
        <div>
            <header className='grid place-items-center pt-5 pb-20 text-white text-xl'>
                <h1>Copybook</h1>
            </header>

            <form className="grid place-items-center space-y-5" action='#' onSubmit={grab_token}>
                <h1 className="text-xl pb-5">Login</h1>
                <input id="Username" type="text" placeholder="Username" className="input input-bordered input-accent w-full max-w-xs text-xl" />
                <input id="Password" type="password" placeholder="Password" className="input input-bordered input-primary w-full max-w-xs text-xl" />
                <button className="btn btn-outline btn-accent w-40">Login</button>
                <Link href="/signup">
                    <a className="link link-accent">Signup ?</a>
                </Link>
            </form>
        </div>
    )
}