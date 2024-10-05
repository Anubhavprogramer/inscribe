import './App.css'
import Navbar from './components/Navbar'
import TextEditor from './components/TextEditor'
import { ColorProvider } from './Contexts/ColorContext'

function App() {

  return (
    <>
      <ColorProvider>
        <Navbar/>
        <TextEditor/>
      </ColorProvider>
    </>
  )
}

export default App
