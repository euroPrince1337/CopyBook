import { useRouter } from 'next/router';
let url = process.env.NEXT_PUBLIC_URL

export default function Signup() {
    const router = useRouter();

    let signup = async (event) => {
        event.preventDefault();
        let username = (document.getElementById("Username") as HTMLInputElement).value;
        let email = (document.getElementById("Email") as HTMLInputElement).value;
        let password = (document.getElementById("Password") as HTMLInputElement).value;

        let token = await fetch(`http://${url}/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, mode: "cors", body: JSON.stringify({ "Username": username, "Email": email, "Password": password }) }).then(r => r.json());
        if (token["status"] == "ok") {
            router.push('/login')
        }
        else {
            alert("Username already exists");
        }
    }

    return (
        <div>
            <header className='grid place-items-center pt-5 pb-20 text-white text-xl'>
                <h1>Copybook</h1>
            </header>

            <form className="grid place-items-center space-y-5" action="#" onSubmit={signup}>
                <h1 className="text-xl pb-5">Signup</h1>
                <input id="Email" type="text" placeholder="Email" className="input input-bordered input-accent w-full max-w-xs text-xl" />
                <input id="Username" type="text" placeholder="Username" className="input input-bordered input-accent w-full max-w-xs text-xl" />
                <input id="Password" type="password" placeholder="Password" className="input input-bordered input-primary w-full max-w-xs text-xl" />
                <button className="btn btn-outline btn-accent w-40">Signup</button>
            </form>
        </div>

    )
}