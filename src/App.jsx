import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Profile from './Pages/Profile/index.jsx'
import Board from './Pages/Board'

function App() {


    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" component={Login}/>
                <Route path="/registration" component={Register}/>
                <Route path="/profile/:userId" component={Profile}/>
                <Route path="/board/:boardId" component={Board}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App
