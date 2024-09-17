import { useState } from 'react'
import './App.css'
import { ToDo } from './components/to-do'

function App() {
  const [count, setCount] = useState(0);

  return (
      
     <ToDo>
      <ToDo.Input />
      <ToDo.List />
     </ToDo>
     
  )
}

export default App
