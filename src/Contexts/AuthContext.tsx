import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, firebase } from "../services/firebase";

interface IAuthContextType  {
    user: IUser | undefined;
    signInWithGoogle: () => Promise<void>;
}
  
interface IUser {
    id: string;
    name: string;
    avatar: string;
}

type IAuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContextType);

export function AuthContextProvider(props: IAuthContextProviderProps) {
    const [user, setUser] = useState<IUser>();

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if(user) {
            const { displayName, photoURL, uid } = user;
  
            if(!displayName || !photoURL) {
              throw new Error('Missing information from Google account');
            }
  
          setUser({
            id: uid,
            name: displayName,
            avatar: photoURL,
          });
        }
      })
  
      return () => {
        unsubscribe();
      }
    }, [user])
  
    async function signInWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider);
  
      if(result.user) {
        const { displayName, photoURL, uid } = result.user;
        
        if(!displayName || !photoURL) {
          throw new Error('Missing information from Google account');
        }
  
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    }

    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    )
}