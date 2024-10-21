import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
import ChatBot from './Chatbot';
import { UserProvider } from './Context';
import AxiosSetup from './AxiosSetup';
import Update from './Update';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AxiosSetup />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/update" element={<Update />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
