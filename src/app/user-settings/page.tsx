"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "../components/navbar";
import { useThemeStore } from "../store/themeStore";
import { FiUser, FiLock, FiMail, FiSettings, FiBell, FiEye, FiEyeOff, FiUpload, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../components/alertDialog";

export default function UserSettings() {
    // State for active tab
    const [activeTab, setActiveTab] = useState("profile");

    // User profile state (replace with your actual user data fetching)
    const [user, setUser] = useState({
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        avatar: "https://www.w3schools.com/w3images/avatar2.png", // Default avatar path
        notifications: {
            email: true,
            push: false,
            marketing: true
        }
    });

    // Form states
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email
    });

    // Password states
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // File upload
    const fileInputRef = useRef(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Notifications state
    const [notifications, setNotifications] = useState(user.notifications);

    // Status messages
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });

    const [showConfirmDialog, setShowConfirmDialog] = useState(false);


    // Update form data when user changes
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email
        });
    }, [user]);

    // Handle profile form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const confirmDeleteAccount = () => {
        setShowConfirmDialog(true);
    }

    const handleConfirmDelete = () => {
        // Handle account deletion logic here
        setStatusMessage({
            type: "success",
            message: "Account deleted successfully!"
        });
        setShowConfirmDialog(false);
    };

    // Handle password form changes
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle profile update
    const handleProfileUpdate = (e) => {
        e.preventDefault();

        // Simulate API call
        setTimeout(() => {
            setUser(prev => ({
                ...prev,
                name: formData.name,
                email: formData.email
            }));

            setStatusMessage({
                type: "success",
                message: "Profile updated successfully!"
            });

            setIsEditing(false);

            // Clear status message after 3 seconds
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 3000);
        }, 1000);
    };

    // Handle password update
    const handlePasswordUpdate = (e) => {
        e.preventDefault();

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatusMessage({
                type: "error",
                message: "New passwords don't match!"
            });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setStatusMessage({
                type: "error",
                message: "Password must be at least 8 characters long"
            });
            return;
        }

        // Simulate API call
        setTimeout(() => {
            setStatusMessage({
                type: "success",
                message: "Password updated successfully!"
            });

            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

            // Clear status message after 3 seconds
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 3000);
        }, 1000);
    };

    // Handle avatar upload
    const handleAvatarClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            // Here you would typically upload the file to your server
            // For now, we'll just update the preview
        }
    };

    const handleRemoveAvatar = () => {
        setPreviewImage(null);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Status message component
    const StatusMessage = () => {
        if (!statusMessage.message) return null;

        const alertClass = statusMessage.type === "success"
            ? "alert-success"
            : "alert-error";

        return (
            <div className={`alert ${alertClass} shadow-lg mb-6 animate-fadeIn`}>
                <div>
                    {statusMessage.type === "success" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    <span>{statusMessage.message}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
                    <p className="text-base-content/70 mb-8">Manage your account information and preferences</p>

                    {/* Status Message */}
                    <StatusMessage />

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar Navigation */}
                        <div className="md:w-64 flex-shrink-0">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body p-0">
                                    <ul className="menu bg-base-100 w-full rounded-box">
                                        <li className={activeTab === "profile" ? "bordered" : ""}>
                                            <a
                                                onClick={() => setActiveTab("profile")}
                                                className={activeTab === "profile" ? "active" : ""}
                                            >
                                                <FiUser className="h-5 w-5" />
                                                Profile Information
                                            </a>
                                        </li>
                                        <li className={activeTab === "security" ? "bordered" : ""}>
                                            <a
                                                onClick={() => setActiveTab("security")}
                                                className={activeTab === "security" ? "active" : ""}
                                            >
                                                <FiLock className="h-5 w-5" />
                                                Security
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-grow">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    {/* Profile Tab */}
                                    {activeTab === "profile" && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-6">Profile Information</h2>

                                            {/* Avatar Section */}
                                            <div className="flex flex-col items-center mb-8">
                                                <div className="avatar mb-4 relative">
                                                    <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
                                                        <img
                                                            src={previewImage || user.avatar || "https://www.w3schools.com/w3images/avatar2.png"}
                                                            alt="User avatar"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        className="btn btn-circle btn-sm absolute bottom-0 right-0 bg-primary text-primary-content"
                                                        onClick={handleAvatarClick}
                                                    >
                                                        <FiUpload className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />

                                                <div className="flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={handleAvatarClick}
                                                    >
                                                        Change Avatar
                                                    </button>
                                                    {previewImage && (
                                                        <button
                                                            className="btn btn-sm btn-error btn-outline"
                                                            onClick={handleRemoveAvatar}
                                                        >
                                                            <FiTrash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Profile Form */}
                                            <form onSubmit={handleProfileUpdate}>
                                                <div className="form-control mb-5">
                                                    <label className="label cursor-pointer">
                                                        <span className="label-text text-sm font-medium text-base-content/80">Full Name</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-50">
                                                            <FiUser className="h-5 w-5 text-base-content/60" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={formData.name}
                                                            onChange={handleInputChange}
                                                            className={`input w-full pl-10 py-3 bg-base-200 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-primary/30 ${!isEditing ? 'opacity-80 cursor-not-allowed' : 'hover:bg-base-200/90'}`}
                                                            disabled={!isEditing}
                                                            placeholder="Enter your full name"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="form-control mb-6">
                                                    <label className="label cursor-pointer">
                                                        <span className="label-text text-sm font-medium text-base-content/80">Email Address</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-50">
                                                            <FiMail className="h-5 w-5 text-base-content/60" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className={`input w-full pl-10 py-3 bg-base-200 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-primary/30 ${!isEditing ? 'opacity-80 cursor-not-allowed' : 'hover:bg-base-200/90'}`}
                                                            disabled={!isEditing}
                                                            placeholder="Enter your email address"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="card-actions justify-end">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost"
                                                                onClick={() => {
                                                                    setIsEditing(false);
                                                                    setFormData({
                                                                        name: user.name,
                                                                        email: user.email
                                                                    });
                                                                }}
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={() => setIsEditing(true)}
                                                        >
                                                            Edit Profile
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Security Tab */}
                                    {activeTab === "security" && (
                                        <div>
                                            <h2 className="card-title text-2xl mb-6">Security Settings</h2>

                                            {/* Password Change Form */}
                                            <form onSubmit={handlePasswordUpdate}>
                                                <div className="form-control mb-5">
                                                    <label className="label cursor-pointer">
                                                        <span className="label-text text-sm font-medium text-base-content/80">Current Password</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-50">
                                                            <FiLock className="h-5 w-5 text-base-content/60" />
                                                        </div>
                                                        <input
                                                            type={showPassword.current ? "text" : "password"}
                                                            name="currentPassword"
                                                            value={passwordData.currentPassword}
                                                            onChange={handlePasswordChange}
                                                            className="input w-full pl-10 pr-12 py-3 bg-base-200 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-primary/30 hover:bg-base-200/90"
                                                            placeholder="Enter current password"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/60 hover:text-primary transition-colors"
                                                            onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                        >
                                                            {showPassword.current ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="form-control mb-5">
                                                    <label className="label cursor-pointer">
                                                        <span className="label-text text-sm font-medium text-base-content/80">New Password</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-50">
                                                            <FiLock className="h-5 w-5 text-base-content/60" />
                                                        </div>
                                                        <input
                                                            type={showPassword.new ? "text" : "password"}
                                                            name="newPassword"
                                                            value={passwordData.newPassword}
                                                            onChange={handlePasswordChange}
                                                            className="input w-full pl-10 pr-12 py-3 bg-base-200 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-primary/30 hover:bg-base-200/90"
                                                            placeholder="Enter new password"
                                                            required
                                                            minLength={8}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/60 hover:text-primary transition-colors"
                                                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                        >
                                                            {showPassword.new ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                    <label className="label">
                                                        <span className="label-text-alt text-xs text-base-content/70">Password must be at least 8 characters long</span>
                                                    </label>
                                                </div>

                                                <div className="form-control mb-6">
                                                    <label className="label cursor-pointer">
                                                        <span className="label-text text-sm font-medium text-base-content/80">Confirm New Password</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-50">
                                                            <FiLock className="h-5 w-5 text-base-content/60" />
                                                        </div>
                                                        <input
                                                            type={showPassword.confirm ? "text" : "password"}
                                                            name="confirmPassword"
                                                            value={passwordData.confirmPassword}
                                                            onChange={handlePasswordChange}
                                                            className="input w-full pl-10 pr-12 py-3 bg-base-200 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 border-0 outline-none focus:ring-2 focus:ring-primary/30 hover:bg-base-200/90"
                                                            placeholder="Confirm your new password"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/60 hover:text-primary transition-colors"
                                                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        >
                                                            {showPassword.confirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="card-actions justify-end">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                    >
                                                        Update Password
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="card bg-base-100 shadow-xl mt-6">
                                <div className="card-body">
                                    <h3 className="text-xl font-bold text-error mb-4">Danger Zone</h3>

                                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border border-error/30 rounded-lg bg-error/5">
                                        <div>
                                            <h4 className="font-medium">Delete Account</h4>
                                            <p className="text-sm text-base-content/70">
                                                Once deleted, your account cannot be recovered
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-error btn-outline mt-4 sm:mt-0"
                                            onClick={() => {
                                                confirmDeleteAccount();
                                            }}
                                        >
                                            Delete Account
                                        </button>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border border-warning/30 rounded-lg bg-warning/5 mt-4">
                                        <div>
                                            <h4 className="font-medium">Export Data</h4>
                                            <p className="text-sm text-base-content/70">
                                                Download all your personal data
                                            </p>
                                        </div>
                                        <button className="btn btn-warning btn-outline mt-4 sm:mt-0">
                                            Export Data
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmDialog(false)}
            />

            {/* Footer with version info */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
                <div>
                    <p className="text-xs">
                        Version 1.0.0 • Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </footer>
        </div>
    );
}
