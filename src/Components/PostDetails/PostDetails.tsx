import { Spinner, Typography } from "@heroui/react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Post from "../Post/Post";
import { useParams } from "react-router-dom";
export default function PostDetails() {

    const { id } = useParams()

    function getSinglePost() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
    }

    const { data, isLoading } = useQuery({
        queryKey: ["Post", id],
        queryFn: getSinglePost
    })

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center "><Spinner size="xl" /></div>
    }
    return <>
        <div className="my-8 max-w-2xl mx-auto">
            <div className="px-4 md:px-0 w-full mb-8">
                <Typography align="center" type="h2" className="text-slate-800 font-bold mb-2">Post Details</Typography>
            </div>

            <div className="px-4 md:px-0 w-full">
                <Post post={data.data.data.post} isPostDetails={true} />
            </div>
        </div>
    </>
}