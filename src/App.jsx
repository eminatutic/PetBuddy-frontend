import React, { useContext } from 'react';
import './App.css';  
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import LogIn from './pages/LogIn/LogIn';
import Footer from './components/Footer/Footer';
import PetsPage from './pages/PetsPage/PetsPage';
import PetDetailsPage from './pages/PetDetailsPage/PetDetailsPage';
import PageByType from './pages/PageByType/PageByType';
import Favorites from './pages/Favorites/Favorites';
import About from './pages/About/About';
import SurveyPage from './pages/SurveyPage/SurveyPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ScrollToTop from './ScrollToTop';
import Offers from './pages/Offers/Offers';
import PackageDetails from './pages/Offers/PackageDetails';
import AdminNav from './components/Navbar/AdminNav';
import AdminUsersPage from './pages/AdminPages/AdminUsersPage';
import AdminReviewsPage from './pages/AdminPages/AdminReviewsPage';
import AdminAddPackage from './pages/AdminPages/AdminAddPackage';
import AdminRentals from './pages/AdminPages/AdminRentals';
import { ToastContainer } from 'react-toastify';
import RentPage from "./pages/RentPage/RentPage";
import { AppContext } from './context/AppContext';

function App() {
const { user, isAdmin, isLoading } = useContext(AppContext);

  return (
    <div className={`app-container ${isAdmin ? "admin-role" : ""}`}>
      <Router>
        <ScrollToTop />
        <Navbar />
{!isLoading && user && isAdmin && <AdminNav />}
        <ToastContainer /> 
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/petsbytype/:type" element={<PageByType />} />
            <Route path="/pet/:petId" element={<PetDetailsPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/package-details/:id" element={<PackageDetails />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/reviews" element={<AdminReviewsPage />} />
            <Route path="/admin/add-package" element={<AdminAddPackage />} />
            <Route path="/admin/rentals" element={<AdminRentals />} />
            <Route path="/rent/:id" element={<RentPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
