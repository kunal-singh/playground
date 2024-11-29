import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import {ToDoContext, ToDoItem} from "./types";

const ToDoComponentContext = createContext<ToDoContext | undefined>(undefined);


export const ToDoProvider = ({children}:{children: ReactNode}) => {
    const [items, setItems] = useState<ToDoItem[]>([]);

    const add: ToDoContext["add"] = useCallback((item)=>{
        setItems(prev=>[...prev, {
          id: prev.length,
          text: item,
          completed: false
        } as ToDoItem])
    },[]);

    const update: ToDoContext["update"] = useCallback((id, text)=>{
         setItems(prev=>prev.map((item)=>item.id===id ? {...item, text} : item))
    },[]);

    const del: ToDoContext["del"] = useCallback((id)=>{
        setItems(prev=>prev.filter((item)=>item.id!==id))
    },[]);

    const toggle: ToDoContext["toggle"] = useCallback((id)=>{
        setItems(prev=>prev.map((item)=>item.id===id ? {...item, completed: !item.completed} : item))
    },[]);
     
    const contextValue: ToDoContext = useMemo(()=>({
      list:items,
      add,
      update,
      del,
      toggle
    }),[items, add, update, del, toggle])
    
    return <ToDoComponentContext.Provider value={contextValue}>{children}</ToDoComponentContext.Provider>
}

export const useToDo = () => {
    const context = useContext(ToDoComponentContext);
    if(!context){
        throw Error("Please use this hook underneath the ToDoProvider");
    }
    return context;
}


