import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import SignUpForm from './components/SignUpForm'
import LoginForm from "./components/LoginForm";

function App() {


  return (
    <div>
      <BrowserRouter>
      {/* <Nav /> */}
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
      Tracethread
      </BrowserRouter>
    </div>
  )
}

export default App
