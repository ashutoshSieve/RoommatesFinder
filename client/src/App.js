import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/DashBoard";
import Profie from "./components/Profile";
import MyPage from "./components/MyPage";
import Message from "./components/Message";
import ChatHistory from './components/ChatHistory';



const App = () =>{
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/profile" element={<Profie/>} />
        <Route path="/mypage" element={<MyPage/>} />
        <Route path="/message/:id" element={<Message/>} />
        <Route path="/chat" element={<ChatHistory/>} />
      </Routes>
    </Router>
  )
}

export default App;