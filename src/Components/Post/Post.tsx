import { Avatar, Button, Dropdown, Label, Typography } from "@heroui/react";
import type { Post as PostType } from "../../Interface/PostInterface";
import { Link } from "react-router-dom";
import CommentHeader from "../CommentHeader/CommentHeader";
import CreateComment from "../CreateComment/CreateComment";
import DeletePost from "../DeletePost/DeletePost";
import { jwtDecode } from "jwt-decode";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

export default function Post({ post, isPostDetails }: { post: PostType, isPostDetails: boolean }) {
    const token = localStorage.getItem("token");
    const { user } = token ? jwtDecode<{ user: string }>(token) : { user: "" };
    const queryClient = useQueryClient();

    const toggleBookmark = useMutation({
        mutationFn: async () => {
            const headers = { "Authorization": "Bearer " + token };
            if (post.bookmarked) {
                // Try DELETE /bookmark for unbookmarking
                try {
                    return await axios.delete(`https://route-posts.routemisr.com/posts/${post.id}/bookmark`, { headers });
                } catch (e: any) {
                    // Fallback to PUT /unbookmark if DELETE is not supported
                    return await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/unbookmark`, {}, { headers });
                }
            } else {
                // PUT /bookmark for bookmarking
                return await axios.put(`https://route-posts.routemisr.com/posts/${post.id}/bookmark`, {}, { headers });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Posts"] });
            queryClient.invalidateQueries({ queryKey: ["UserPost"] });
            toast.success(post.bookmarked ? "Post removed from bookmarks" : "Post bookmarked!");
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to toggle bookmark");
        }
    });

    return <>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-4">
                    <Avatar size="lg">
                        <Avatar.Image alt={post.user.name} src={post.user.photo} />
                        <Avatar.Fallback>{post.user.name?.[0]}</Avatar.Fallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-base">{post.user.name}</h3>
                        <p className="text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {user === post.user._id ? <div className="actions">
                        <DeletePost id={post.id} />
                    </div> : null}
                </div>
            </div>

            <div className="mb-5">
                {post?.body ? <p className="text-slate-700 leading-relaxed text-base mb-4">{post.body}</p> : null}
                {post?.image ? <div className="rounded-xl overflow-hidden bg-slate-100 mt-3 mb-4"><img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-96" /></div> : null}
                {isPostDetails === false ? <Link className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 mb-4 inline-block" to={`/postDetails/${post.id}`}>View full post &rarr;</Link> : null}
            </div>
            
            {/* Action Bar */}
            <div className="flex items-center gap-6 mb-4 px-2 border-t border-slate-100 pt-4">
                <button 
                    onClick={() => toggleBookmark.mutate()}
                    disabled={toggleBookmark.isPending}
                    className={`flex items-center gap-2 text-sm font-semibold transition-colors ${post.bookmarked ? 'text-blue-600' : 'text-slate-500 hover:text-blue-600'}`}
                >
                    <i className={`fa-bookmark ${post.bookmarked ? 'fa-solid' : 'fa-regular'} ${toggleBookmark.isPending ? "animate-pulse" : ""}`}></i>
                    <span>{post.bookmarked ? 'Saved' : 'Save Post'}</span>
                </button>
            </div>

            {post?.topComment && isPostDetails === false ? (
                <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-3">
                            <Avatar size="sm">
                                <Avatar.Image alt={post.topComment.commentCreator.name} src={post.topComment.commentCreator.photo} />
                                <Avatar.Fallback>{post.topComment.commentCreator.name?.[0]}</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm">{post.topComment.commentCreator.name}</p>
                                <p className="text-xs text-slate-500">{new Date(post.topComment.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-700 text-sm ml-11">{post.topComment.content}</p>
                </div>
            ) : null}

            {post.commentsCount > 0 && isPostDetails === true ? (
                <div className="mt-6 pt-6 border-t border-slate-100">
                    <CommentHeader id={post.id} />
                </div>
            ) : null}

            <div className="mt-4 border-t border-slate-100 pt-4">
                <CreateComment id={post.id} />
            </div>
        </div>
    </>
}