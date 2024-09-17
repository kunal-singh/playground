import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";

type ToDo = {
	id: number;
	text: string;
	done: boolean;
};

interface ToDoContext {
	items: ToDo[];
	addToDo: (text: string) => void;
	toggleToDo: (id: number) => void;
	deleteToDo: (id: number) => void;
}

const ToDoContext = createContext<ToDoContext | undefined>(undefined);

export function ToDo({ children }: { children: ReactNode }) {
	const [toDos, setToDos] = useState<ToDoContext["items"]>([]);

	const addToDo = useCallback(
		(text: string) => {
      console.log(text,'adding')
			setToDos([...toDos, { id: Date.now(), text, done: false }]);
		},
		[toDos, setToDos],
	);

	const toggleToDo = useCallback(
		(id: number) => {
			setToDos(
				toDos.map((toDo) =>
					toDo.id === id ? { ...toDo, done: !toDo.done } : toDo,
				),
			);
		},
		[toDos, setToDos],
	);

	const deleteToDo = useCallback(
		(id: number) => {
			setToDos(toDos.filter((toDo) => toDo.id !== id));
		},
		[toDos, setToDos],
	);

	const value: ToDoContext = {
		items: toDos,
		addToDo,
		toggleToDo,
		deleteToDo,
	};
	return <ToDoContext.Provider value={value}>{children}</ToDoContext.Provider>;
}
ToDo.List = ToDoList;
ToDo.Input = ToDoInput;
ToDo.Item = ToDoItem;

function ToDoList() {
	const context = useContext(ToDoContext);
	if (!context) {
		throw new Error("ToDoList must be used within a ToDoProvider");
	}

	const { items } = context;
	return (
		<>
			{items.map((toDo) => (
				<ToDoItem
					key={toDo.id}
					id={toDo.id}
					text={toDo.text}
					done={toDo.done}
				/>
			))}
		</>
	);
}


function ToDoInput() {
  const [value, setValue] = useState<string>("")
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error("ToDoList must be used within a ToDoProvider");
  }

  const { addToDo } = context;

  const handleClick = () => {
    if (!value) {
      return;
    }
    console.log(value)
    addToDo(value);
    setValue("");
  };
	return (
		<>
			<input type="text" className="input" value={value} onChange={(e) => setValue(e.target.value)} />
			<button className="button" type="submit" onClick={handleClick}>
				Add
			</button>
		</>
	);
}

function ToDoItem({ ...props }: ToDo) {
	const context = useContext(ToDoContext);
	if (!context) {
		throw new Error("ToDoList must be used within a ToDoProvider");
	}

	const { toggleToDo, deleteToDo } = context;
	const { id, text, done } = props;
	return (
		<li>
			<input type="checkbox" checked={done} onChange={() => toggleToDo(id)} />
			<span>{text}</span>
			<button onClick={() => deleteToDo(id)}>X</button>
		</li>
	);
}

export function useToDo() {
	const context = useContext(ToDoContext);
	if (!context) {
		throw new Error("ToDoList must be used within a ToDoProvider");
	}
	return context;
}
