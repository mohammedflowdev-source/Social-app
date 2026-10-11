import { Avatar, Spinner } from "@heroui/react";
import CreatePost from "../CreatePost/CreatePost";
import Post from "../Post/Post";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Profile() {
    const [activeTab, setActiveTab] = useState("myPosts");
    const { user }: { user: string } = jwtDecode(localStorage.getItem("token") || "");

    function getUserPost() {
        return axios.get(`https://route-posts.routemisr.com/users/${user}/posts`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
    }

    const { data, isLoading } = useQuery({
        queryKey: ["UserPost"],
        queryFn: getUserPost
    })

    const { data: userProfileData } = useQuery({
        queryKey: ["UserDetails", user],
        queryFn: () => axios.get(`https://route-posts.routemisr.com/users/${user}`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        }).catch(() => axios.get(`https://route-posts.routemisr.com/users/profile-data`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        }))
    });

    const { data: allPostsData } = useQuery({
        queryKey: ["AllPostsProfile"],
        queryFn: () => axios.get("https://route-posts.routemisr.com/posts?limit=50", {
            headers: { "Authorization": "Bearer " + localStorage.getItem("token") }
        })
    });

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center "><Spinner size="xl" /></div>
    }

    const userDetails = userProfileData?.data?.user || userProfileData?.data?.data?.user || {};
    const postsList = data?.data?.data?.posts || [];
    
    const allPosts = allPostsData?.data?.data?.posts || [];
    const savedPostsList = allPosts.filter((post: any) => post.bookmarked === true);

    const postCount = postsList.length;
    const name = userDetails.name || postsList[0]?.user?.name || "User";
    
    // Process photo URL correctly
    let rawPhoto = userDetails.photo || postsList[0]?.user?.photo;
    const photo = rawPhoto 
        ? (rawPhoto.startsWith("http") ? rawPhoto : `https://route-posts.routemisr.com/${rawPhoto}`) 
        : "https://img.heroui.chat/image/avatar?w=400&h=400&u=3";

    const email = userDetails.email || "user@example.com";
    const followers = userDetails.followers?.length || 0;
    const following = userDetails.following?.length || 0;
    const bookmarks = savedPostsList.length || userDetails.bookmarks?.length || userDetails.savedPosts?.length || 0;
    const savedPosts = bookmarks;

    const currentListToDisplay = activeTab === "myPosts" ? postsList : savedPostsList;

    return <>
        <div className="max-w-5xl mx-auto mb-10 pt-8 px-4">

            {/* Header Banner & Profile Card Container */}
            <div className="relative mb-6">
                {/* Dark Blue Cover Photo */}
                <div className="h-64 bg-gradient-to-br from-slate-900 to-slate-700 rounded-3xl w-full shadow-sm"></div>

                {/* Overlapping White Card */}
                <div className="relative -mt-24 mx-4 md:mx-8 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row gap-8">

                    {/* Left Column */}
                    <div className="flex-1">
                        <div className="flex items-center gap-6 mb-8">
                            <Avatar className="w-24 h-24 text-large border-4 border-white shadow-sm bg-slate-100">
                                <Avatar.Image alt={name} src={photo} />
                                <Avatar.Fallback>{name?.[0]}</Avatar.Fallback>
                            </Avatar>
                            <div>
                                <h2 className="text-3xl font-black text-slate-800">{name}</h2>
                                <p className="text-slate-500 font-medium mb-3">@{name.toLowerCase().replace(/\s+/g, "")}</p>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                                    <i className="fa-solid fa-user-check"></i> Route Posts member
                                </span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-extrabold text-slate-800 mb-4 uppercase tracking-wide">About</h3>
                            <div className="space-y-3 text-slate-600 text-sm font-medium">
                                <p className="flex items-center gap-3"><i className="fa-regular fa-envelope text-slate-400 text-lg"></i> {email}</p>
                                <p className="flex items-center gap-3"><i className="fa-solid fa-users text-slate-400 text-lg"></i> Active on Route Posts</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Top Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50">
                                <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Followers</p>
                                <p className="text-2xl font-black text-slate-800">{followers}</p>
                            </div>
                            <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50">
                                <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Following</p>
                                <p className="text-2xl font-black text-slate-800">{following}</p>
                            </div>
                            <div className="border border-slate-100 rounded-2xl p-4 text-center bg-slate-50">
                                <p className="text-[10px] font-bold text-slate-500 tracking-wider mb-1 uppercase">Bookmarks</p>
                                <p className="text-2xl font-black text-slate-800">{bookmarks}</p>
                            </div>
                        </div>

                        {/* Bottom Stats */}
                        <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
                            <p className="text-[10px] font-bold text-blue-600 tracking-wider mb-1 uppercase">My Posts</p>
                            <p className="text-2xl font-black text-slate-800">{postCount}</p>
                        </div>
                        <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
                            <p className="text-[10px] font-bold text-blue-600 tracking-wider mb-1 uppercase">Saved Posts</p>
                            <p className="text-2xl font-black text-slate-800">{savedPosts}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-8 flex justify-between items-center max-w-5xl mx-auto">
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab("myPosts")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${activeTab === 'myPosts' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <i className="fa-solid fa-file-lines"></i> My Posts
                    </button>
                    <button 
                        onClick={() => setActiveTab("saved")}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors ${activeTab === 'saved' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                    >
                        <i className="fa-regular fa-bookmark"></i> Saved
                    </button>
                </div>
                <div className="px-4">
                    <span className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">
                        {activeTab === "myPosts" ? postCount : savedPosts}
                    </span>
                </div>
            </div>

            {/* Posts */}
            <div className="max-w-3xl mx-auto">
                {activeTab === "myPosts" ? <CreatePost /> : null}
                <div className="mt-8">
                    {currentListToDisplay.length > 0 ? (
                        currentListToDisplay.map(function (post: any, idx: number) {
                            return <Post key={idx} post={post} isPostDetails={false} />;
                        })
                    ) : (
                        <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
                            <i className={`text-4xl text-slate-300 mb-3 ${activeTab === 'myPosts' ? 'fa-solid fa-file-lines' : 'fa-regular fa-bookmark'}`}></i>
                            <p className="text-slate-500 font-medium">No posts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
}