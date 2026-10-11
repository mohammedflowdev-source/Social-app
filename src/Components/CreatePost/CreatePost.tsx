import { Button, Input, Spinner, TextArea } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function CreatePost() {


    const queryClient = useQueryClient()

    const [imgSrc, setImgSrc] = useState(null)
    const [img, setImg] = useState<File | null>(null)

    const postBody = useRef<HTMLTextAreaElement>(null)
    const PostImage = useRef<HTMLInputElement>(null)

    const { isPending, mutate } = useMutation({
        mutationFn: createPost,
        onSuccess: (data) => {
            toast.success(data.data.message)
            // queryClient.invalidateQueries({
            //     queryKey: ["comments", id],
            // })
            queryClient.invalidateQueries({
                queryKey: ["Posts"],
            })
            queryClient.invalidateQueries({
                queryKey: ["UserPost"],
            })

            closeImage()
            postBody.current.value = ""
        },
        onError: (error) => {
            toast.error(error.response.data.message)
        }
    })

    function createPost() {
        const formData = new FormData()

        if (postBody.current.value != "") {
            formData.append("body", postBody.current.value)
        }

        if (img != null) {
            formData.append("image", img)
        }


        return axios.post("https://route-posts.routemisr.com/posts", formData, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })




    }


    function handleImage() {
        const url = URL.createObjectURL(PostImage.current.files?.[0])
        setImgSrc(url)
        setImg(PostImage.current.files?.[0])

    }

    function closeImage() {
        setImgSrc(null)
        PostImage.current!.value = ""
    }
    return <>
        <div className="my-5 w-full mx-auto bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-shadow hover:shadow-md">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Create Post</h2>
            <div className="mb-4">
                <TextArea ref={postBody} rows={4} fullWidth={true} placeholder="What's on your mind?" />
            </div>

            {imgSrc ? (
                <div className="relative mb-5 rounded-xl overflow-hidden border border-slate-200">
                    <button onClick={closeImage} className="absolute top-2 right-2 bg-slate-800/60 hover:bg-slate-800/80 text-white rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-colors z-10">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <img src={imgSrc} className="w-full h-auto object-cover max-h-96" alt="Preview" />
                </div>
            ) : (
                <div className="flex items-center justify-center w-full mb-5">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-36 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                            <svg className="w-8 h-8 mb-3 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" /></svg>
                            <p className="mb-1 text-sm"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                            <p className="text-xs">SVG, PNG, JPG or GIF</p>
                        </div>
                        <input onChange={handleImage} ref={PostImage} id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div>
            )}

            <Button onClick={() => mutate()} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-all shadow-sm">
                {isPending ? <Spinner size="sm" color="white" /> : "Publish Post"}
            </Button>
        </div>
    </>
}