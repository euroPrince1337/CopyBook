import Link from 'next/link'

export default function PostBox({
    content,
    user,
    id
}: {
    content: string
    user: string
    id: number
}) {
    return (
        <Link href={`/post/${id}`}>
        <div className="card w-96 card-side text-white hover:bg-base-300">
            <div className="card-body">
                <Link href={`/profile/${user}`}>
                    <h2 className="hover:text-primary card-title">{user}</h2>
                </Link>
                <p className="text-xl">{content}</p>
                <div className="card-actions justify-end">
                {/*<button className="btn btn-primary">Like</button>*/ }
                </div>
            </div>
        </div>
        </Link>
    )
}