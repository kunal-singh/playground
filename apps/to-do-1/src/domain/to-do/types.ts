export type ToDoItem = {
	id: number;
	text: string;
	completed: boolean;
};

export type ToDoContext = {
	list: ToDoItem[];
	add: (item: string) => void;
	update: (id: number, text: string) => void;
	del: (id: number) => void;
	toggle: (id: number) => void;
};
