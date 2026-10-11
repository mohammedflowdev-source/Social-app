import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../../Context/AuthContext";
import { Button } from "@heroui/react";

export default function Navbar() {

    const { token, logoutContext } = useContext(authContext)
    const Navigate = useNavigate()

    function logout() {
        logoutContext()
        Navigate("/login")

    }
    return <>
        <div className="sticky top-0 z-50 py-3 px-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                    Socialize
                </Link>
                <ul className="flex gap-6 items-center text-slate-600 font-medium">
                    {token ? <>
                        <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
                        <li><Link to="/profile" className="hover:text-blue-600 transition-colors">Profile</Link></li>
                        <li><Button onClick={logout} className="bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-medium px-6 py-2 transition-all border-none">Logout</Button></li>
                    </> : <>
                        <li><Link to="/login" className="hover:text-blue-600 transition-colors">Login</Link></li>
                        <li><Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 transition-all shadow-md">Register</Link></li>
                    </>}
                </ul>
            </div>
        </div>

    </>
}