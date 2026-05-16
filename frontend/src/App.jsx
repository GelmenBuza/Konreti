import {BrowserRouter, Routes, Route} from 'react-router'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Profile from './Pages/Profile/index.jsx'
import Board from './Pages/Board'

function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/board/:boardId" element={<Board/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
