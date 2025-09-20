import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import axiosInstance from '../../axios/axiosInstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaw, faBars, faTimes, faUserCircle, faRightFromBracket, faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../context/AppContext';
import Button from '../Button/Button';

function Navbar() {
  const location = useLocation();
  const { user, isUser, isAdmin, logout } = useContext(AppContext);
  const [click, setClick] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  const handleLogout = async () => {
    if (!user) return;
    try {
      await axiosInstance.post('/User/logout');
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
    logout();
    setProfileMenuOpen(false);
    closeMobileMenu();
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          PetBuddy <FontAwesomeIcon icon={faPaw} />
        </Link>

        <div className="menu-icon" onClick={handleClick}>
          <FontAwesomeIcon icon={click ? faTimes : faBars} />
        </div>

        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          {!isAdmin && (
            <li className="nav-item">
            <Link to="/pets" className={`nav-links ${isActive('/pets') ? 'active' : ''}`} onClick={closeMobileMenu} 
            style={{ 
              color: '#1e7a34',
              fontWeight: 'bold'
            }}>
              VIEW PETS
            </Link>
          </li>
           )}
          <li className="nav-item">
            <Link to="/" className={`nav-links ${isActive('/') ? 'active' : ''}`} onClick={closeMobileMenu}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/offers" className={`nav-links ${isActive('/offers') ? 'active' : ''}`} onClick={closeMobileMenu}>
              Offers
            </Link>
          </li>

          {isUser && (
            <li className="nav-item">
              <Link to="/favorites" className={`nav-links ${isActive('/favorites') ? 'active' : ''}`} onClick={closeMobileMenu}>
                Favorites
              </Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/about" className={`nav-links ${isActive('/about') ? 'active' : ''}`} onClick={closeMobileMenu}>
              About
            </Link>
          </li>

          {!user && (
            <li className="nav-item" id="log">
              <Link
                to="/login"
                className="nav-links"
                onClick={closeMobileMenu}
                state={{ from: location }}
              >
                Log in <FontAwesomeIcon icon={faRightToBracket} />
              </Link>
            </li>
          )}

          {user && isMobile && (
            <>
              {isUser && (
                <li className="nav-item">
                  <Link
                    to="/profile"
                    className="nav-links"
                    onClick={closeMobileMenu}
                  >
                    Profile
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="nav-links logout-link" onClick={handleLogout}>
                  Logout <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              </li>
            </>
          )}

          {user && !isMobile && (
            <li className="nav-item profile-menu" ref={dropdownRef}>
              <FontAwesomeIcon
                icon={faUserCircle}
                className="profile-icon"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              />
              {profileMenuOpen && (
                <div className="profile-dropdown">
                  {isUser && (
                    <Link
                      to="/profile"
                      className="profile-dropdown-item"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        closeMobileMenu();
                      }}
                    >
                      View Profile
                    </Link>
                  )}
                  <Button
                    className="logout-btn"
                    onClick={handleLogout}
                    text="Log out"
                    icon={faRightFromBracket}
                  />
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
