import React from "react";
import { NavLink } from "react-router-dom";
import "./AdminNav.css";
function AdminNav() {
  return (
    <nav className="admin-nav">
      <div className="nav-content">
        <ul>
          <li>
            <NavLink
              to="/pets"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              VIEW PETS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              VIEW USERS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              VIEW REVIEWS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/rentals"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              VIEW RENTALS
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default AdminNav;