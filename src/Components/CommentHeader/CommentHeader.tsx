import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Comment } from "../../Interface/CommentsInterface";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export default function CommentHeader({ id }: { id: string }) {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");
    const { user: currentUserId } = token ? jwtDecode<{ user: string }>(token) : { user: "" };

    function getPostComment() {
        return axios.get(`https://route-posts.routemisr.com/posts/${id}/comments?page=1&limit=10`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    }

    const { data } = useQuery({
        queryKey: ["comments", id],
        queryFn: getPostComment
    })

    const toggleLike = useMutation({
        mutationFn: async ({ commentId, isLiked }: { commentId: string, isLiked: boolean }) => {
            const headers = { "Authorization": "Bearer " + token };
            
            if (isLiked) {
                // Unlike using PUT to /unlike
                return axios.put(`https://route-posts.routemisr.com/posts/${id}/comments/${commentId}/unlike`, {}, { headers });
            } else {
                // Like using PUT to /like
                return axios.put(`https://route-posts.routemisr.com/posts/${id}/comments/${commentId}/like`, {}, { headers });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", id] });
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to toggle like");
        }
    });

    return <>
        {data?.data?.data?.comments?.map(function (comment: Comment, idx: number) {
            const isLiked = comment.likes?.some((like: any) => like === currentUserId || like._id === currentUserId);
            const isToggling = toggleLike.isPending && toggleLike.variables?.commentId === comment._id;

            return (
                <div key={comment._id || idx} className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <Avatar size="sm">
                                <Avatar.Image alt={comment.commentCreator.name} src={comment.commentCreator.photo} />
                                <Avatar.Fallback>{comment.commentCreator.name?.[0]}</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">{comment.commentCreator.name}</p>
                                <p className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="actions">
                            <Dropdown>
                                <Button aria-label="Menu" className="bg-transparent text-slate-400 hover:bg-slate-200 hover:text-slate-600 rounded-full min-w-0 px-2 h-8 font-bold">
                                    ...
                                </Button>
                                <Dropdown.Popover>
                                    <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                                        <Dropdown.Item id="edit-file" textValue="Edit file">
                                            <Label>Edit comment</Label>
                                        </Dropdown.Item>
                                        <Dropdown.Item id="delete-file" textValue="Delete file" variant="danger">
                                            <Label className="text-red-500">Delete comment</Label>
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown.Popover>
                            </Dropdown>
                        </div>
                    </div>
                    {comment.content ? <p className="text-slate-700 text-sm ml-11 mb-2 leading-relaxed">{comment.content}</p> : null}
                    {comment.image ? (
                        <div className="ml-11 rounded-lg overflow-hidden border border-slate-200 mt-2 max-w-xs mb-2">
                            <img src={comment.image} className="w-full h-auto object-cover" alt="Comment attachment" />
                        </div>
                    ) : null}
                    
                    <div className="ml-11 mt-3 flex items-center gap-4">
                        <button 
                            onClick={() => toggleLike.mutate({ commentId: comment._id, isLiked })} 
                            disabled={isToggling}
                            className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${isLiked ? "text-blue-600" : "text-slate-500 hover:text-blue-600"}`}
                        >
                            <i className={`fa-heart ${isLiked ? "fa-solid" : "fa-regular"} ${isToggling ? "animate-pulse" : ""}`}></i>
                            <span>{comment.likes?.length || 0}</span>
                        </button>
                    </div>
                </div>
            );
        })}
    </>
}