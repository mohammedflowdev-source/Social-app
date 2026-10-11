import { Button } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

export default function DeletePost({ id }: { id: string }) {

    const queryClient = useQueryClient()

    function deletePost() {
        return axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
    }

    const { mutate } = useMutation({
        mutationFn: deletePost,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["Posts"]
            })
            queryClient.invalidateQueries({
                queryKey: ["UserPost"]
            })
            toast.success(data.data.message)
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response?.data?.message || "Failed to delete post")
        }
    })
    return <>
        <div>
            <Button onClick={() => mutate()} variant="danger">Delete</Button>
        </div>
    </>
}