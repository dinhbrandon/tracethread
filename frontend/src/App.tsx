import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import SignUpForm from './components/SignUpForm'
import LoginForm from "./components/LoginForm";
import SearchForm from "./components/SearchForm";

function App() {
  const handleOnSearch = (url: string) => {
    console.log(`Searching for ${url}`);
  }

  return (
    <div>
      <BrowserRouter>
      {/* <Nav /> */}
      <Routes>
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/search" element={<SearchForm onSearch={handleOnSearch} />} />
      </Routes>
      Tracethread
      </BrowserRouter>
    </div>
  )
}

export default App
