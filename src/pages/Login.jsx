import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false); // ← local state
    const { login } = useAuth(); // ← remove "loading" from here
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true); // ← start local loading
        try {
            const result = await login({ email, password });
            if (result.success) {
                navigate("/dashboard", { replace: true });
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setSubmitting(false); // ← stop local loading
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Login</h2>
                {error && <p className="mb-4 text-red-500 text-center">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="email"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={submitting} // ← use submitting
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="password"
                            className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={submitting} // ← use submitting
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 transition disabled:opacity-60"
                        disabled={submitting} // ← use submitting
                    >
                        {submitting ? "Logging in..." : "Login"} {/* ← use submitting */}
                    </button>
                </form>
            </div>
        </div>
    );
}