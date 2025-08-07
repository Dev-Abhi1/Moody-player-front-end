import FacialExpression from "./components/FacialExpression"
import { useState } from "react"
import MoodSongs from "./components/MoodSongs"


const App = () => {
  const [songs, setSongs] = useState([])
  return (
    <div >
      <FacialExpression setSongs={setSongs}/>
      <MoodSongs songs={songs}/>
    </div>
  )
}

export default App