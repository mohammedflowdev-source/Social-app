import { Button, Input, Spinner } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreateComment({ id }: { id: string }) {

    const queryClient = useQueryClient()

    const [imgSrc, setImgSrc] = useState(null)
    const [img, setImg] = useState<File | null>(null)

    const commentContent = useRef<HTMLInputElement>(null)
    const commentImage = useRef<HTMLInputElement>(null)

    const { isPending, mutate } = useMutation({
        mutationFn: createComment,
        onSuccess: (data) => {
            toast.success(data.data.message)
            queryClient.invalidateQueries({
                queryKey: ["comments", id],
            })
            queryClient.invalidateQueries({
                queryKey: ["Posts"],
            })
            queryClient.invalidateQueries({
                queryKey: ["UserPost"],
            })

            closeImage()
            commentContent.current.value = ""
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error.response.data.message)
        }
    })

    function createComment() {
        const formData = new FormData()

        if (commentContent.current.value != "") {
            formData.append("content", commentContent.current.value)
        }

        if (img != null) {
            formData.append("image", img)
        }


        return axios.post(`https://route-posts.routemisr.com/posts/${id}/comments`, formData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })




    }


    function handleImage() {
        const url = URL.createObjectURL(commentImage.current.files?.[0])
        setImgSrc(url)
        setImg(commentImage.current.files?.[0])

    }

    function closeImage() {
        setImgSrc(null)
        commentImage.current!.value = ""
    }
    return <>
        <div className="mt-2 w-full flex flex-col gap-3">
            <div className="flex gap-2 w-full items-center">
                <div className="flex-1">
                    <Input ref={commentContent} type="text" fullWidth={true} placeholder="Write your comment..." className="w-full" />
                </div>
                
                <div className="relative shrink-0">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center w-10 h-10 rounded-xl transition-colors">
                        <i className="fa-regular fa-image"></i>
                        <input onChange={handleImage} ref={commentImage} type="file" className="hidden" />
                    </label>
                </div>
                
                <Button onClick={() => mutate()} className="bg-blue-600 hover:bg-blue-700 text-white min-w-0 px-5 h-10 rounded-xl font-medium transition-colors shadow-sm shrink-0">
                    {isPending ? <Spinner size="sm" color="white" /> : "Send"}
                </Button>
            </div>

            {imgSrc ? (
                <div className="relative w-fit rounded-lg overflow-hidden border border-slate-200 mt-1 ml-2">
                    <button onClick={closeImage} className="absolute top-1 right-1 bg-slate-800/60 hover:bg-slate-800/80 text-white rounded-full w-6 h-6 flex items-center justify-center backdrop-blur-sm transition-colors z-10 text-xs">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <img src={imgSrc} className="w-48 h-auto object-cover max-h-48" alt="Preview" />
                </div>
            ) : null}
        </div>
    </>
}