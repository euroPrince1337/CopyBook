import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Dashboard from '../../components/ui';
import CommentBox from '../../components/comment';

export default function Profile() {
    const router = useRouter();

    let pid = router.query.pid as string;
    let [post, setPost] = useState({text: ""});
    let [comments, setComments] = useState([]);
    useEffect(() => {
        if (!router.isReady) return;
        let token = localStorage.getItem("Token");
        let ps = async () => {
            pid = router.query.pid as string;
            setPost(await fetch(`http://127.0.0.1:3000/posts/${pid}`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
            setComments(await fetch(`http://127.0.0.1:3000/comments/${pid}`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
        }
        ps().catch(console.error);
    }, [router.isReady]);

    let refreshComments = () => {
        let token = localStorage.getItem("Token");
        let ps = async () => {
            setComments(await fetch(`http://127.0.0.1:3000/comments/${pid}`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
        }
        ps().catch(console.error);
    }

    let newComment = async () => {
        let token = localStorage.getItem("Token");
        let y = document.getElementById("commentContent") as HTMLInputElement;
        await fetch("http://127.0.0.1:3000/comment", { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, mode: "cors", body: JSON.stringify({ "post_id": parseInt(pid), "content": y.value }) });
        y.value = "";
        refreshComments();
    }
    return (
        <div>
            <Dashboard />
            <main className='flex flex-col place-items-center space-y-3'>
                <h1 className='text-2xl text-white'>{post.text}</h1>
                <textarea id="commentContent" className="textarea textarea-secondary text-xl" placeholder="New comment..."></textarea>
                <button className="btn btn-outline btn-secondary w-20" onClick={newComment}>Comment</button>
                <div className="divider"></div>
                <div className='pt-10'>
                    {comments["Array"] != undefined ? comments["Array"].map(comment => {
                        return (
                            <CommentBox content={comment["Text"]} user={comment["Commenter"]} id={comment["PostId"]} />
                        );
                    }) : ""}
                </div>
            </main>
        </div>
    )
}