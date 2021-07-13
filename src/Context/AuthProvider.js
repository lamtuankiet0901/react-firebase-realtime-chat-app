import { Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { auth } from '../firebase/config'

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const [user, setUser] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const history = useHistory()

    useEffect(() => {
        const unsubcibed = auth.onAuthStateChanged((user) => {
            console.log(user)
            if(user){
                const { displayName, email, uid, photoURL } = user
                setUser({
                    displayName, 
                    email, 
                    uid, 
                    photoURL
                })
                setIsLoading(false);
                history.push("/")
                return;
            }
            setIsLoading(false)
            history.push("/login")
        })

        return () => {
            unsubcibed()
        }
    },[history])
    

    return (
        <AuthContext.Provider value={{user}}>
            {isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    )
}
