"use client";
import { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import UseUserStore from "../store/UserStore";
import {
    FiUser, FiLock, FiMail, FiSettings, FiEye, FiEyeOff,
    FiUpload, FiTrash2, FiShield, FiCheck, FiX, FiSave, FiRefreshCw
} from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { HiOutlinePhotograph } from "react-icons/hi";
import { RiShieldKeyholeLine } from "react-icons/ri";
import { updateUserProfile, uploadProfileImage, fetchUserProfile, deteleUser } from "../../../api/api";
import useAuth from "../hooks/UseAuth";
import ConfirmDialog from "../components/alertDialog";
import { useRouter } from "next/navigation";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function UserSettings() {

    const { user, updateUser, logout } = UseUserStore();
    const { isAuthenticated } = useAuth(false);
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: user?.email || "",
        username: user?.username || ""
    });
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", message: "" });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || "",
                username: user.username || ""
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const result = await fetchUserProfile();
            if (result.success && result.data?.data) {
                const userData = result.data.data;
                updateUser(userData);
                setFormData({
                    email: userData.email || "",
                    username: userData.username || ""
                });
                setPreviewImage(userData.profileImage);
            } else {
                setStatusMessage({
                    type: "error",
                    message: result.error || "Error al obtener el perfil de usuario"
                });
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, []);

    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ""
    });

    const handleBackHome = () => {
        router.push("/home");
    }

    const confirmDeleteAccount = () => {
        setShowConfirmDialog(true);
    }

    const handleConfirmDelete = async () => {
        setShowConfirmDialog(false);
        setIsLoading(true);
        setStatusMessage({ type: "", message: "" });

        try {
            const result = await deteleUser();
            if (result.success) {
                setStatusMessage({
                    type: "success",
                    message: "Cuenta eliminada con éxito"
                });
                logout();
            } else {
                throw new Error(result.error || "Error al eliminar la cuenta");
            }
        }
        catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Un error ocurrió al eliminar la cuenta."
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 5000);
        }
    };

    const handleInputChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const evaluatePasswordStrength = (password: string): void => {
        if (!password) {
            setPasswordStrength({ score: 0, message: "" });
            return;
        }

        let score = 0;
        // Check password length
        if (password.length >= 8) score += 2;
        if (password.length >= 12) score += 1;
        // Check for uppercase letters
        if (/[A-Z]/.test(password)) score += 1;
        // Check for lowercase letters
        if (/[a-z]/.test(password)) score += 1;
        // Check for numbers
        if (/[0-9]/.test(password)) score += 1;
        // Check for special characters
        if (/[^A-Za-z0-9]/.test(password)) score += 2;

        const message = score < 3 ? "Debil" : score < 6 ? "Moderada" : "Fuerte";
        setPasswordStrength({ score, message });
    };

    const handlePasswordChange = (e: { target: { name: string; value: string; }; }) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "newPassword") {
            evaluatePasswordStrength(value);
        }
    };

    const handleProfileUpdate = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ type: "", message: "" });

        try {
            const result = await updateUserProfile({
                username: typeof formData.username === "string" ? formData.username : "",
                email: formData.email,
                password: ""
            });

            console.log("Profile update result:", result);

            if (result.success) {
                updateUser({
                    ...user,
                    email: formData.email,
                    username: formData.username
                });

                setStatusMessage({
                    type: "success",
                    message: "Perfil actualizado con éxito!"
                });
                setIsEditing(false);
            } else {
                throw new Error(result.error || "Error al actualizar el perfil");
            }
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Un error ocurrió al actualizar el perfil."
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 5000);
        }
    };

    const handlePasswordUpdate = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ type: "", message: "" });

        // Validate passwords
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setStatusMessage({
                type: "error",
                message: "Las contraseñas no coinciden"
            });
            setIsLoading(false);
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setStatusMessage({
                type: "error",
                message: "La nueva contraseña debe tener al menos 8 caracteres"
            });
            setIsLoading(false);
            return;
        }

        try {
            const result = await updateUserProfile({
                username: "",
                email: "",
                password: passwordData.newPassword,
            });

            if (result.success) {
                setStatusMessage({
                    type: "success",
                    message: "¡Contraseña actualizada con éxito!"
                });

                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setPasswordStrength({ score: 0, message: "" });
            } else {
                throw new Error(result.error || "Error al actualizar la contraseña");
            }
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Error al actualizar la contraseña"
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 5000);
        }
    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];

        // Update preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(typeof reader.result === "string" ? reader.result : null);
        };
        reader.readAsDataURL(file);

        try {
            setIsUploading(true);

            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 300);

            const result = await uploadProfileImage(file);
            clearInterval(progressInterval);
            setUploadProgress(100);

            if (result.success) {
                updateUser({
                    ...user,
                    profileImage: result.data.profileImage
                });

                setStatusMessage({
                    type: "success",
                    message: "Imagen de perfil actualizada con éxito!"
                });
            } else {
                throw new Error(result.error || "Error al subir la imagen de perfil");
            }
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Error al subir la imagen de perfil"
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 3000);
        }
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-base-200">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4">Cargando tu Perfil...</p>
                </div>
            </div>
        );
    }

    const renderPasswordStrengthIndicator = () => {
        if (!passwordData.newPassword) return null;

        const getColorClass = () => {
            if (passwordStrength.score < 3) return 'bg-error';
            if (passwordStrength.score < 6) return 'bg-warning';
            return 'bg-success';
        };

        return (
            <div className="mt-2">
                <div className="w-full bg-base-300 h-2 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getColorClass()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 7) * 100}%` }}
                    ></div>
                </div>
                <p className={`text-xs mt-1 ${passwordStrength.score < 3 ? 'text-error' :
                    passwordStrength.score < 6 ? 'text-warning' : 'text-success'
                    }`}>
                    Contraseña {passwordStrength.message}
                </p>
            </div>
        );
    };

    const handleLogOut = async () => {
        setIsLoading(true);
        setStatusMessage({ type: "", message: "" });
        try {
            logout();
            setStatusMessage({
                type: "success",
                message: "Sesión cerrada con éxito"
            });
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Error al cerrar sesión"
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage({ type: "", message: "" }), 3000);
        }
    }

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-base-300 to-base-200">
            <Navbar />

            <div className="container mx-auto px-4 py-8 flex-grow">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div className="flex items-start gap-4">
                            {/* Back button*/}
                            <button
                                onClick={handleBackHome}
                                className="flex gap-2 btn btn-primary btn-outline m-1 shadow-md text-left px-4 font-medium "
                            >
                                <IoMdArrowRoundBack className="h-5 w-5" />
                                <span>Volver</span>
                            </button>

                            {/* Title and description */}
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Configuración de Cuenta</h1>
                                <p className="text-sm sm:text-base text-base-content/70">
                                    Gestione la información y preferencias de su cuenta
                                </p>
                            </div>
                        </div>

                        {/* Email*/}
                        <div className="mt-4 sm:mt-0">
                            <span className="badge badge-primary badge-outline p-3">
                                {user?.email}
                            </span>
                        </div>
                    </div>

                    {/* Status Message */}
                    <StatusMessage />

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar Navigation */}
                        <div className="md:w-64 flex-shrink-0">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body p-4">
                                    {/* Avatar in sidebar */}
                                    <div className="flex flex-col items-center mb-6">
                                        <div className="avatar mb-3 relative group">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300">
                                                {(previewImage || user?.avatar) ? (
                                                    <img
                                                        src={previewImage || (user?.avatar as string | undefined)}
                                                        alt="User avatar"
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-base-content/70 text-4xl">
                                                        <HiOutlinePhotograph />
                                                    </div>
                                                )}

                                                {/* Overlay for upload progress */}
                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-base-300/80 flex flex-col items-center justify-center">
                                                        <div className="radial-progress text-primary" style={{ "--value": uploadProgress } as React.CSSProperties} role="progressbar">
                                                            {uploadProgress}%
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Hover overlay with edit button */}
                                                <div className="absolute inset-0 bg-base-300/0 group-hover:bg-base-300/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <button
                                                        className="btn btn-circle btn-sm bg-primary text-primary-content"
                                                        onClick={handleAvatarClick}
                                                        disabled={isUploading}
                                                    >
                                                        <FiUpload className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="font-medium text-lg">{user?.name || "User"}</h3>
                                        <p className="text-xs text-base-content/70">{typeof user?.username === "string" ? user.username : ""}</p>

                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>

                                    <ul className="menu bg-base-100 w-full rounded-box p-0">
                                        <li className={activeTab === "profile" ? "bordered" : ""}>
                                            <a
                                                onClick={() => setActiveTab("profile")}
                                                className={`${activeTab === "profile" ? "active font-medium" : ""} flex items-center gap-3`}
                                            >
                                                <FiUser className="h-5 w-5" />
                                                Información sobre el perfil
                                            </a>
                                        </li>
                                        <li className={activeTab === "security" ? "bordered" : ""}>
                                            <a
                                                onClick={() => setActiveTab("security")}
                                                className={`${activeTab === "security" ? "active font-medium" : ""} flex items-center gap-3`}
                                            >
                                                <RiShieldKeyholeLine className="h-5 w-5" />
                                                Seguridad
                                            </a>
                                        </li>
                                        <button
                                            className="btn btn-error btn-sm sm:btn-md gap-2 mt-4 text-white"
                                            onClick={handleLogOut}
                                            disabled={isLoading}
                                        >
                                            <FiLogOut className="h-5 w-5" />
                                            Cerrar Sesión
                                        </button>

                                    </ul>

                                    <div className="mt-6 pt-6 border-t border-base-300">
                                        <span className="text-xs text-base-content/50">Último acceso: {new Date().toLocaleDateString()}</span>
                                    </div>
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
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="card-title text-xl sm:text-2xl flex items-center gap-2">
                                                    <FiUser className="text-primary" />
                                                    Información sobre el perfil
                                                </h2>
                                                {isEditing ? (
                                                    <div className="badge badge-warning">Editando</div>
                                                ) : (
                                                    <div className="badge badge-success">Actualizado</div>
                                                )}
                                            </div>

                                            {/* Profile Form */}
                                            <form onSubmit={handleProfileUpdate} className="space-y-6">

                                                <div className="form-control mb-5">
                                                    <label className="label">
                                                        <span className="label-text font-medium text-base-content/80">Nombre de usuario</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-50">
                                                            <span className="text-primary/70">@</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            name="username"
                                                            value={typeof formData.username === "string" ? formData.username : ""}
                                                            onChange={handleInputChange}
                                                            className={`input input-bordered w-full pl-10 py-2 sm:py-3 bg-base-200/50 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 ${!isEditing ? 'opacity-80 cursor-not-allowed' : 'hover:bg-base-200'}`}
                                                            disabled={!isEditing || isLoading}
                                                            placeholder="Choose a username"
                                                        />
                                                    </div>
                                                    <label className="label">
                                                        <span className="label-text-alt text-xs text-base-content/60">
                                                            Tu nombre de usuario único para identificarte
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="form-control mb-6">
                                                    <label className="label">
                                                        <span className="label-text font-medium text-base-content/80">Dirección de correo electrónico</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-50">
                                                            <FiMail className="h-5 w-5 text-primary/70" />
                                                        </div>
                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={formData.email}
                                                            onChange={handleInputChange}
                                                            className={`input input-bordered w-full pl-10 py-2 sm:py-3 bg-base-200/50 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 ${!isEditing ? 'opacity-80 cursor-not-allowed' : 'hover:bg-base-200'}`}
                                                            disabled={!isEditing || isLoading}
                                                            placeholder="Enter your email address"
                                                            required
                                                        />
                                                    </div>
                                                    <label className="label">
                                                        <span className="label-text-alt text-xs text-base-content/60">
                                                            Nunca compartiremos su correo electrónico con nadie
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="divider"></div>

                                                <div className="card-actions justify-end">
                                                    {isEditing ? (
                                                        <>
                                                            <button
                                                                type="button"
                                                                className="btn btn-ghost btn-sm sm:btn-md gap-2"
                                                                onClick={() => {
                                                                    setIsEditing(false);
                                                                    setFormData({
                                                                        email: user?.email || "",
                                                                        username: user?.username || ""
                                                                    });
                                                                }}
                                                                disabled={isLoading}
                                                            >
                                                                <FiX />
                                                                Cancel
                                                            </button>
                                                            <button
                                                                type="submit"
                                                                className="btn btn-primary btn-sm sm:btn-md gap-2"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <>
                                                                        <span className="loading loading-spinner loading-xs"></span>
                                                                        Guardando...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FiSave />
                                                                        Guardar Cambios
                                                                    </>
                                                                )}
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm sm:btn-md gap-2"
                                                            onClick={() => setIsEditing(true)}
                                                        >
                                                            <FiSettings />
                                                            Editar perfil
                                                        </button>
                                                    )}
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Security Tab */}
                                    {activeTab === "security" && (
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <h2 className="card-title text-xl sm:text-2xl flex items-center gap-2">
                                                    <RiShieldKeyholeLine className="text-primary" />
                                                    Ajustes de seguridad
                                                </h2>
                                                <div className="badge badge-info">
                                                    Última actualización: {new Date().toLocaleDateString()}
                                                </div>
                                            </div>

                                            {/* Password Change Form */}
                                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                                <div className="alert bg-base-200/50 shadow-sm mb-6">
                                                    <div className="flex items-start gap-3">
                                                        <FiLock className="mt-1 text-info" />
                                                        <div>
                                                            <h3 className="font-semibold text-sm">Gestión de contraseñas</h3>
                                                            <p className="text-xs text-base-content/70">
                                                                Le recomendamos que utilice una contraseña única y segura que no utilice en otros sitios web.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-control mb-5">
                                                    <label className="label">
                                                        <span className="label-text font-medium text-base-content/80">New Password</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-50">
                                                            <FiLock className="h-5 w-5 text-primary/70" />
                                                        </div>
                                                        <input
                                                            type={showPassword.new ? "text" : "password"}
                                                            name="newPassword"
                                                            value={passwordData.newPassword}
                                                            onChange={handlePasswordChange}
                                                            className="input input-bordered w-full pl-10 pr-12 py-2 sm:py-3 bg-base-200/50 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 hover:bg-base-200 border-1 focus:border-primary"
                                                            placeholder="Ingresa tu nueva contraseña"
                                                            required
                                                            minLength={8}
                                                            disabled={isLoading}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/60 hover:text-primary transition-colors"
                                                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                            disabled={isLoading}
                                                        >
                                                            {showPassword.new ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                    {renderPasswordStrengthIndicator()}
                                                </div>

                                                <div className="form-control mb-6">
                                                    <label className="label">
                                                        <span className="label-text font-medium text-base-content/80">Confirmar nueva contraseña</span>
                                                    </label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-50">
                                                            <FiLock className="h-5 w-5 text-primary/70" />
                                                        </div>
                                                        <input
                                                            type={showPassword.confirm ? "text" : "password"}
                                                            name="confirmPassword"
                                                            value={passwordData.confirmPassword}
                                                            onChange={handlePasswordChange}
                                                            className="input input-bordered w-full pl-10 pr-12 py-2 sm:py-3 bg-base-200/50 focus:bg-base-200/80 rounded-md shadow-sm transition-all duration-300 hover:bg-base-200 border-1 focus:border-primary"
                                                            placeholder="Confirma tu nueva contraseña"
                                                            required
                                                            disabled={isLoading}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="absolute inset-y-0 right-0 flex items-center px-3 text-base-content/60 hover:text-primary transition-colors"
                                                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                            disabled={isLoading}
                                                        >
                                                            {showPassword.confirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                                                        </button>
                                                    </div>
                                                    <label className="label">
                                                        <span className={`label-text-alt text-xs ${passwordData.newPassword && passwordData.confirmPassword &&
                                                            passwordData.newPassword !== passwordData.confirmPassword
                                                            ? 'text-error'
                                                            : 'text-base-content/60'
                                                            }`}>
                                                            {passwordData.newPassword && passwordData.confirmPassword &&
                                                                passwordData.newPassword !== passwordData.confirmPassword
                                                                ? 'Las contraseñas no coinciden'
                                                                : 'Repite tu nueva contraseña para confirmarla'
                                                            }
                                                        </span>
                                                    </label>
                                                </div>

                                                <div className="divider"></div>

                                                <div className="card-actions justify-end">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary btn-sm sm:btn-md gap-2"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <>
                                                                <span className="loading loading-spinner loading-xs"></span>
                                                                Actualizado...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FiRefreshCw />
                                                                Actualizar contraseña
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </form>

                                            {/* Security Tips */}
                                            <div className="mt-12">
                                                <h3 className="font-semibold text-lg mb-4">Consejos de seguridad</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="bg-base-200/50 p-4 rounded-lg border border-base-300">
                                                        <div className="flex items-start gap-3">
                                                            <div className="text-warning mt-1">
                                                                <FiShield className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-sm">Utilice una contraseña segura</h4>
                                                                <p className="text-xs text-base-content/70">
                                                                    Mezcla mayúsculas, minúsculas, números y caracteres especiales.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-base-200/50 p-4 rounded-lg border border-base-300">
                                                        <div className="flex items-start gap-3">
                                                            <div className="text-info mt-1">
                                                                <FiCheck className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-sm">Actualizaciones periódicas</h4>
                                                                <p className="text-xs text-base-content/70">
                                                                    Cambia tu contraseña con regularidad para mayor seguridad.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="card bg-base-100 shadow-xl mt-6">
                                <div className="card-body">
                                    <h3 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-error mb-4">
                                        <FiTrash2 />
                                        Zona de peligro
                                    </h3>

                                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-2 border-error/30 rounded-lg bg-error/5">
                                        <div>
                                            <h4 className="font-medium">Eliminar cuenta</h4>
                                            <p className="text-xs sm:text-sm text-base-content/70">
                                                Todos tus datos se eliminarán de forma permanente y no se podrán recuperar.
                                            </p>
                                        </div>
                                        <button
                                            className="btn btn-error btn-outline mt-4 sm:mt-0 gap-2"
                                            onClick={confirmDeleteAccount}
                                            disabled={isLoading}
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                            Eliminar cuenta
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
                title="Eliminar cuenta"
                description="¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer y todos tus datos se perderán permanentemente."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmDialog(false)}
            />

            {/* Footer with version info */}
            <footer className="footer footer-center p-4 bg-base-300 text-base-content mt-auto">
                <div className="flex flex-col sm:flex-row gap-2 items-center text-xs text-base-content/70">
                    <p>Version 1.0.0</p>
                    <div className="hidden sm:block">•</div>
                    <p>Última actualización: {new Date().toLocaleDateString()}</p>
                    <div className="hidden sm:block">•</div>
                    <p>© 2025 Cryptoplayground</p>
                </div>
            </footer>
        </div >
    );
}