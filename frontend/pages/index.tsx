import PostBox from '../components/post';
import Dashboard from '../components/ui';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
let url = process.env.NEXT_PUBLIC_URL;
export default function Home(props) {
  const router = useRouter();
  let [posts, setPosts] = useState([]);
  useEffect(() => {
    let token = localStorage.getItem("Token");
    let ps = async () => {
      setPosts(await fetch(`http://${url}/posts`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
    }
    ps().catch(console.error);
    setInterval(refreshPosts, 20000)
  }, []);

  if (posts["status"] == "bad") {
    localStorage.removeItem("Token");
    router.push("/login");
  }

  let content = [];
  if (posts.length != 0 && posts["status"] == undefined) {
    content = Object.assign([], posts.map(post => {
      return [post.Content, post.ID, post.Username]
    }));
    content.reverse()
  }

  let refreshPosts = async() => {
    let token = localStorage.getItem("Token");
    let ps = async () => {
      setPosts(await fetch(`http://${url}/posts`, { headers: { "Authorization": `Bearer ${token}` }, mode: "cors" }).then(r => r.json()));
    }
    ps().catch(console.error);
  }

  let newPost = async () => {
    let token = localStorage.getItem("Token");
    let y = document.getElementById("postContent") as HTMLInputElement;
    await fetch(`http://${url}/create`, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, mode: "cors", body: JSON.stringify({ Title: "UI", Content: y.value }) });
    y.value = "";
    await refreshPosts();
  }

  return (
        <div>
        <Dashboard />
        <main className='flex flex-col place-items-center space-y-3'>
        <textarea id="postContent" className="textarea textarea-secondary text-xl" placeholder="What's on your mind ?"></textarea>
        <button className="btn btn-outline btn-secondary w-20" onClick={newPost}>Post</button>
        {content.length != 0 ? content.map(post => {
          return <PostBox id={post[1]} content={post[0]} key={post[1]} user={post[2]}/>
        }) : ""}
        </main>
      </div>

  )
}
