import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor } from './redux/store';
import store from './redux/store';
import Nav from './components/Nav';
import Footer from './components/Footer';
import AboutUs from './components/AboutUs';
import OpenRoles from './components/OpenRoles';
import SignUpForm from './components/SignUpForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import JobNotebook from './components/JobNotebook';
import EditColumns from './components/EditColumns';
import JobSearch from './components/JobSearch';
import Support from './components/Support';
import Pricing from './components/Pricing';
import ContactUs from './components/ContactUs';
import Tutorial from './components/Tutorial';
import SavedParameters from './components/SavedParameters';
import Home from './components/Home';
import FeedbackPage from './components/FeedbackPage';
import { useState } from 'react';


function App() {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);

  const toggleLoginModal = () => {
    setLoginModalVisible(!loginModalVisible);
  };

  const toggleSignUpModal = () => {
    setSignUpModalVisible(!signUpModalVisible);
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Nav />
            <div className="flex-grow mb-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUpForm toggleSignUpModal={toggleSignUpModal} toggleLoginModal={toggleLoginModal} />} />
                <Route path="/login" element={<LoginForm toggleSignUpModal={toggleSignUpModal} toggleLoginModal={toggleLoginModal} />} />
                <Route path="/info" element={<Dashboard />} />
                <Route path="/jobnotebook" element={<JobNotebook />} />
                <Route path="/editcolumns" element={<EditColumns />} />
                <Route path="/search" element={<JobSearch />} />
                <Route path="/search/filters" element={<SavedParameters isVisible={true} refreshKey={true} onSearch={() => {}} savedParameters={[]} />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/careers" element={<OpenRoles />} />
                <Route path="/support" element={<Support />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/tutorial" element={<Tutorial />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
