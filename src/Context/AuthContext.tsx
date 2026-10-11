import { createContext, useEffect, useState, type ReactNode } from "react"

export interface AuthContextType {
    token: string | null
    insertUserToken: (tkn: string) => void
    logoutContext: () => void
}

export const authContext = createContext<AuthContextType>({
    token: null,
    insertUserToken: () => {},
    logoutContext: () => {},
})



export default function AuthContextProvider({ children }: { children: ReactNode }) {

    const [token, setToken] = useState<string | null>(null)


    function insertUserToken(tkn: string) {
        setToken(tkn)
    }

    function logoutContext() {
        setToken(null)
        localStorage.removeItem("token")
    }

    console.log(token, "context")

    useEffect(function () {
        if (localStorage.getItem("token") != null) {
            setToken(localStorage.getItem("token"))
        }
    }, [])

    return (
        <authContext.Provider value={
            { insertUserToken, token, logoutContext }
        }>
            {children}
        </authContext.Provider>
    )
}