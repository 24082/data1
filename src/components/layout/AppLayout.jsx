import Sidebar from "./Sidebar";
import AppBar from "./AppBar";

export default function AppLayout({ children }) {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen">
                <AppBar />
                <main className="flex-1 overflow-auto p-6 bg-gray-50" role="main">
                    {children}
                </main>
            </div>
        </div>
    );
}