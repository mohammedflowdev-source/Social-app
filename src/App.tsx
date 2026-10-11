import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./Components/Layout/Layout"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import Register from "./Components/Register/Register"
import NotFound from "./Components/NotFound/NotFound"
import { Toaster } from "react-hot-toast"
import AuthContextProvider from "./Context/AuthContext"
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute"
import Profile from "./Components/Profile/Profile"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import PostDetails from "./Components/PostDetails/PostDetails"



function App() {

  const router = createBrowserRouter([
    {
      path: "", element: <Layout />, children: [
        { path: "", element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
        { path: "postDetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "*", element: <NotFound /> },
      ]
    }
  ])


  const queryClient = new QueryClient()
  return (
    <>


      <AuthContextProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContextProvider>
    </>
  )
}

export default App
