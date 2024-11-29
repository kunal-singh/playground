import './App.css'
import { ToDoProvider } from './domain/to-do'
import { ToDo } from './components/to-do'

function App() {
 
  return (
    <>
          <ToDoProvider>
            <ToDo>
              <ToDo.Form />
              <ToDo.List />
              <ToDo.Meta />
            </ToDo>
          </ToDoProvider>
    </>
  )
}

export default App
