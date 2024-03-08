import { useContext } from "react"
import { MainContextApi } from "./contextapi/mainapi"
import Login from "./components/Login";
import Calling from "./components/Calling";



function App() {
  const {userName}=useContext(MainContextApi);

  return (
    <>
    {!(userName) ?<Login/>:<Calling/>}
    </>
  )
}

export default App
