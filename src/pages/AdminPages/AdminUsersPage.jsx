import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../axios/axiosInstance";
import "./AdminUsersPage.css";
import Modal from "../../components/Modal/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from "../../context/AppContext";
import Button from "../../components/Button/Button";
import DUsers from "../../components/DUsers/DUsers"; 
import Loader from "../../components/Loader/Loader";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AdminUsersPage() {
    const { isAdmin } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [deactivatedUsers, setDeactivatedUsers] = useState([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDUsersOpen, setIsDUsersOpen] = useState(false); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);  
    const [userToActivate, setUserToActivate] = useState(null);
    const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get("/User/all-users");
            setUsers(response.data);
        } catch (err) {
            console.log(err.message);
            setError("Error fetching users from server."); 
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDeactivatedUsers = async () => {
        try {
            const response = await axiosInstance.get("/User/deactivated-users");
            setDeactivatedUsers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const confirmDeleteUser = (userId) => {
        setUserToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            await axiosInstance.delete(`/User/delete-user/${userToDelete}`);
            setUsers(users.filter(user => user.id !== userToDelete));
            toast.success("User deleted successfully!");
             await fetchDeactivatedUsers();
        } catch (err) {
            console.log(err.message);
            toast.error("Error deleting user.");
        }
        setIsDeleteModalOpen(false);
    };

    const confirmActivateUser = (userId) => {
        setUserToActivate(userId);
        setIsActivateModalOpen(true);
    };

    const handleActivateUser = async () => {
        if (!userToActivate) return;

        try {
            await axiosInstance.put(`/User/activate-user/${userToActivate}`);
            toast.success("User activated successfully!");
          
            await fetchUsers();
            await fetchDeactivatedUsers();

            setUserToActivate(null);
        } catch (err) {
            console.error(err);
            toast.error("Error activating user.");
        }
        setIsActivateModalOpen(false);
    };

    const handleCloseDUsers = () => {
        setIsDUsersOpen(false);
    };

    useEffect(() => {
        if (isAdmin) {
            fetchUsers();
            fetchDeactivatedUsers();
        }
    }, [isAdmin]);

    if (!isAdmin) {
        return <p>Access denied.</p>;
    }

    return (
        <div className="admin-users-page">
            <h1 className="admin-title">User management</h1>

            <div className="admin-deactivated-button-container">
                <Button
                    text="Deactivated accounts"
                    className="deactivated-button"
                    onClick={() => setIsDUsersOpen(true)} 
                />
            </div>

            {isLoading ? (
                <Loader />
            ) : error ? (
                <div className="error-message" style={{ color: "red", padding: "20px" }}>
                    {error}
                </div>
            ) : (
                <table className="admin-users-table">
                    <thead>
                        <tr>
                            <th className="column-wide">Username</th>
                            <th className="column-wide">Email</th>
                            <th className="column-icon"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="no-users-message">
                                    There are no registered users.
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user.id}>
                                    <td className="column-wide">{user.userName}</td>
                                    <td className="column-wide">{user.email}</td>
                                    <td className="column-icon">
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            className="admin-delete-icon"
                                            title="Delete user"
                                            onClick={() => confirmDeleteUser(user.id)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteUser}
                message="Are you sure you want to delete this user?"
            />
            <Modal
                isOpen={isActivateModalOpen}
                onClose={() => setIsActivateModalOpen(false)}
                onConfirm={handleActivateUser}
                message="Are you sure you want to activate this user account?"
            />
            <DUsers
                isOpen={isDUsersOpen}
                onClose={handleCloseDUsers}
                onActivateClick={confirmActivateUser}
                users={deactivatedUsers}  
            />
        </div>
    );
}

export default AdminUsersPage;
