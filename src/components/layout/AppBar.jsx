import { LogOut, User, ChevronDown, Edit, CheckCircle, AlertCircle, X, Eye, EyeOff } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext,useRef } from 'react';
import api from "../../services/httpService";
import { toast } from 'react-toastify';
//import { ThemeContext } from '../../constant/ThemeContext';
import { jwtDecode } from "jwt-decode";

export default function AppBar() {
    const navigate = useNavigate();
    const [templeName, setTempleName] = useState('');
    const { themeColor } = useContext(ThemeContext);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    // const [userId, setUserId] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });

    const profileDropdownRef=useRef(null)
    useEffect(() => {
        api.get('/v1/temple_setting/one')
            .then(res => {
                const data = res.data;
                setTempleName(data.name);
            })
            .catch(err => {
                console.error('Failed to load temple info:', err);
            });
   

    // function logout() {
    //     localStorage.clear();
    //     navigate('/login');
    // }
        
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            navigate("/login");
            return;
        }

        const decodedToken = jwtDecode(token);
        setEditingId(decodedToken.id);

        api.get('/v1/auth/me/?id=' + decodedToken.id)
        .then(res => {
        const data = res.data;
        setFirstName(data.data.firstName);
        setLastName(data.data.lastName);
        setUserEmail(data.data.email);
        setFormData({
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
            password: ""
        });
        })
        .catch(err => {
        console.error('Failed to load User:', err);
        setSnackbar({
            open: true,
            message: "Failed to load user data",
            severity: "error"
        });
        });
    }, [navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); 

    
    useEffect(() => {
        if (snackbar.open) {
            const timer = setTimeout(() => {
                setSnackbar({ open: false, message: '', type: '' });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [snackbar.open]);

    const showSnackbar = (message, type) => {
        setSnackbar({ open: true, message, type });
    };

    
    function handleLogout() {
        setShowLogoutConfirm(true);
        setShowProfileDropdown(false);
    }

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const email = e.target.value;
        setFormData({ ...formData, email });
        setEmailError(!validateEmail(email) && email.length > 0);
    };



    function handleLogoutConfirm() {
        localStorage.clear();
        navigate('/login');
    }

     function handleEditProfile() {
        // if (userId) {
        //     api.get(`/v1/auth/user/${userId}`)
        //         .then(res => {
        //             const userData = res.data;
        //             setFirstName(userData.firstName || '');
        //             setLastName(userData.lastName || '');
        //             setUserEmail(userData.email || '');
        //         })
        //         .catch(err => {
        //             console.error('Failed to load user data:', err);
        //             showSnackbar('Failed to load user data', 'error');
        //         });
        // }
        setShowEditProfile(true);
        setShowProfileDropdown(false);
    }

    const updateUserProfile = async () => {
        if (emailError || !formData.firstName || !formData.lastName || !formData.email) {
        showSnackbar("Please fill in all required fields correctly", "error");
        return;
        }

        try {
        setLoading(true);
        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
        };

        if (formData.password.trim() !== "") payload.password = formData.password;

        await api.put(`/v1/auth/user/${editingId}`, payload);

        setShowEditProfile(false);
        setFormData({ ...formData, password: "" });
        // showSnackbar("User updated successfully", "success");
        toast.success("User updated successfully", { autoClose: 3000 });
        } catch (err) {
        console.error("Profile update failed:", err);
        toast.error(err.response?.data?.message || "Failed to update profile", { autoClose: 3000 });
        // showSnackbar(err.response?.data?.message || "Failed to update profile", "error");
        } finally {
        setLoading(false);
        }
    };


    const cancelEditProfile = () => {
        setShowEditProfile(false);
        setFormData({ ...formData, password: "" });
    };

    return (
        <>
       
            <header className="h-16 w-full flex items-center px-6" style={{ backgroundColor: themeColor }}>
                <div className="flex-1" />
                <h1 className="text-lg font-semibold text-indigo-800 items-center">{templeName}</h1>
                <div className="flex-1" />
                
                <div className="relative" ref={profileDropdownRef}>
                    <button
                        className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 transition-all duration-300 hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 group"
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center border-2 border-white/60 shadow-lg transition-all duration-300 group-hover:border-white group-hover:from-indigo-500 group-hover:to-indigo-700">
                            <User className="w-5 h-5 text-white" />
                        </div>
                        <ChevronDown
                            className={`w-4 h-4 text-indigo-800 transition-transform duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {showProfileDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                            <div className="p-2">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 truncate">
                                                {firstName} {lastName}
                                            </span>
                                            <span className="text-xs text-gray-500 truncate">
                                                {userEmail}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center gap-3 group mt-2"
                                    onClick={handleEditProfile}
                                >
                                    <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-200">
                                        <Edit className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 block">Edit Profile</span>
                                        <span className="text-xs text-gray-500">Update your information</span>
                                    </div>
                                </button>

                                <button
                                    className="w-full px-4 py-3 text-left rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-3 group"
                                    onClick={handleLogout}
                                >
                                    <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
                                        <LogOut className="w-4 h-4 text-red-600" />
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 block">Log Out</span>
                                        <span className="text-xs text-gray-500">End your session</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {showEditProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
                                <Edit className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                                <p className="text-sm text-gray-500">Update your account information</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your last name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={handleEmailChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="Enter your email"
                                />
                                {emailError && (
                                    <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                                </label>
                                <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    placeholder="Enter new password (leave blank to keep current)"
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">Leave blank to keep your current password</p>
                            </div>
                        </div>

                        <div className="flex space-x-3 justify-end mt-6">
                            <button
                                onClick={cancelEditProfile}
                                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateUserProfile}
                                disabled={loading || emailError || !formData.firstName || !formData.lastName || !formData.email}
                                className="px-5 py-2 text-white rounded-lg hover:brightness-90 transition font-medium flex items-center gap-2"
                                style={{ backgroundColor: themeColor }}

                            >
                                <Edit className="w-4 h-4" />
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLogoutConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-80 text-center">
                        <p className="text-lg font-semibold mb-4">Are you sure you want to logout?</p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                onClick={handleLogoutConfirm}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                                onClick={() => setShowLogoutConfirm(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {snackbar.open && (
                <div className="fixed top-4 right-4 z-[60] animate-slide-in">
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
                        snackbar.type === 'success' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-red-500 text-white'
                    }`}>
                        {snackbar.type === 'success' ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <AlertCircle className="w-5 h-5" />
                        )}
                        <span className="font-medium">{snackbar.message}</span>
                        <button 
                            onClick={() => setSnackbar({ open: false, message: '', type: '' })}
                            className="ml-2 hover:opacity-80"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}