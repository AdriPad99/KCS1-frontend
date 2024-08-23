import { useState } from 'react'
import CreateTaskComponent from './components/CreateTaskComponent'
import AllTasksComponent from './components/AllTasksComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CreateTaskComponent/>
      <AllTasksComponent/>
    </>
  )
}

export default App
