import { Spinner, Typography } from "@heroui/react";
import axios from "axios";
import Post from "../Post/Post";
import { useQuery } from "@tanstack/react-query";
import CreatePost from "../CreatePost/CreatePost";
import type { Post as PostType } from "../../Interface/PostInterface";


export default function Home() {

    function getAllPosts() {
        return axios.get("https://route-posts.routemisr.com/posts", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
    }

    const { data, isLoading } = useQuery({
        queryKey: ["Posts"],
        queryFn: getAllPosts,
        refetchInterval: 3000
    })

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center "><Spinner size="xl" /></div>
    }



    return (
        <>
            <div className="my-8 max-w-2xl mx-auto">
                <div className="px-4 md:px-0 w-full mb-8">
                    <Typography align="center" type="h2" className="text-slate-800 font-bold mb-2">Feed</Typography>
                    <p className="text-center text-slate-500 text-sm">See what your friends are up to</p>
                </div>

                <div className="px-4 md:px-0 w-full">
                    <CreatePost />
                    
                    <div className="mt-8">
                        {data?.data.data.posts.map(function (post: PostType, idx: number) {
                            return <Post key={idx} post={post} isPostDetails={false} />;
                        })}
                    </div>
                </div>
            </div>
        </>
    );

}






