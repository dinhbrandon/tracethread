import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store';
import store from './redux/store';
import Nav from './components/Nav';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import JobNotebook from './components/JobNotebook';
import EditColumns from './components/EditColumns';
import JobSearch from './components/JobSearch';
import SavedParameters from './components/SavedParameters';
import Home from './components/Home';

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div>
          <BrowserRouter>
                <Nav />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpForm  />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobnotebook" element={<JobNotebook />} />
                <Route path="/editcolumns" element={<EditColumns />} />
                <Route path="/search" element={<JobSearch />} />
                <Route path="/saved" element={<SavedParameters isVisible={true} />} />
              </Routes>
          </BrowserRouter>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
