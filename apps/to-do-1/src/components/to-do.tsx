import { ChangeEvent, FormEvent, ReactNode, useCallback, useState } from "react";
import { ToDoItem, useToDo } from "../domain/to-do";

export const ToDo = ({children}:{children: ReactNode}) => {
    return <div className="shadow-sm w-full">{children}</div>;
}


export const Form = () => {
    const {add} = useToDo();
    const [value, setValue] = useState<ToDoItem["text"]>("");

    const handleSubmit = useCallback((e: FormEvent)=>{
       e.preventDefault();
       if(!value)
         return;
       add(value);
       setValue("");
    },[add, value]);

    const handleChange = useCallback((e:ChangeEvent<HTMLInputElement>)=>{
      setValue(e.target.value);
    },[value, setValue])

    return <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between w-full">
        <input type="text" onChange={handleChange} value={value} />
        <button type="submit" className="primary">Add</button>
        </div>
    </form>
}

const ListItem = ({value}:{value:ToDoItem}) => {
    const {toggle, del} = useToDo();
   
    const handleChange = useCallback((e: ChangeEvent) => {
       toggle(value.id)
    },[toggle, value]);

    const handleClick = useCallback(()=>{
      del(value.id);
    },[value, del])

   return <div className="flex items-center justify-between w-full">
    <input type="checkbox" onChange={handleChange} checked={value.completed} />
    <div>{value.text}</div>
    <button type="button" onClick={handleClick}>Delete</button>
   </div>
}

export const List = () => {
    const {list} = useToDo();
    const renderList = () => {
        return list.map(item=><ListItem key={item.id} value={item}/>)
    }
   return <div className="flex flex-col gap-2 my-4">
        {renderList()}
   </div>;
}

export const Meta = () => {
    const {list} = useToDo();
    return <div className="bg-gray-600 border border-gray-400 p-2 flex items-start">
       {`Total Items: ${list.length} Completed: ${list.filter(i=>i.completed).length}`} 
    </div>
}


ToDo.List = List;
ToDo.Meta = Meta;
ToDo.Form = Form;