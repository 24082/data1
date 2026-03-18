import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronFirst, ChevronLast, ChevronDown, ChevronRight } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { SidebarContext } from "./SidebarContext";
import CONSTANT from "../../constant/constant";
import api from "../../services/httpService";

export default function Sidebar() {
    const [expanded, setExpanded] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);
    const contextValue = useMemo(() => ({ expanded }), [expanded]);
    const location = useLocation();
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        api.get('/v1/temple_setting/one')
        .then(res => {
            const data = res.data;
            setImageUrl(data.temple_image);
        })
        .catch(err => {
            console.error('Failed to load temple info:', err);
        });
    }, []);

    const toggleDropdown = (name) => {
        setOpenDropdown((prev) => (prev === name ? null : name));
    };

    const getAllowedMenus = () => {
        const userModules = JSON.parse(localStorage.getItem("modules")) || [];
        console.log(userModules);

        return CONSTANT.MENUS.filter(menu =>
            !menu.permission || userModules.includes(menu.permission)
        );
    };

    const menus = getAllowedMenus();

    return (
        <aside className="h-screen " role="navigation" aria-label="Main menu">
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <div className="flex justify-center items-center w-full">
                        {expanded && imageUrl && (
                            <img
                                src={`${CONSTANT.CLOUDINARY_BASE_URL}/${imageUrl}`}
                                alt="Temple Logo"
                                className="w-20 h-12 object-cover border"
                            />
                        )}
                    </div>
                    <button 
                        onClick={() => setExpanded((curr) => !curr)}
                        className="p-1.5 ml-1 rounded-lg bg-gray-50 hover:bg-gray-100"
                        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {expanded ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>

                <SidebarContext.Provider value={contextValue}>
                 <ul className="flex-1 px-3 overflow-y-auto overflow-x-hidden scrollbar-thin">
                        {/* {CONSTANT.MENUS.map((menu) => { */}
                        {menus.map((menu) => {
                            if (menu.children) {
                                const isOpen = openDropdown === menu.name;
                                return (
                                    <div key={menu.name} role="group" aria-label={menu.name}>
                                        <div
                                            className="flex items-center text-gray-500 px-3 py-3 text-sm font-semibold tracking-wide cursor-pointer hover:text-gray-700"
                                            onClick={() => toggleDropdown(menu.name)}
                                        >
                                            {menu.icon && <span className="mr-2">{menu.icon}</span>}
                                            {expanded && (
                                                <>
                                                    <span>{menu.name}</span>
                                                    <span className="ml-auto">
                                                        {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        {isOpen && expanded && (
                                            <ul className="pl-6">
                                                {menu.children.map((child) => (
                                                    <SidebarItem
                                                        key={child.path}
                                                        icon={child.icon}
                                                        text={child.name}
                                                        active={location.pathname === child.path}
                                                        onClick={() => navigate(child.path)}
                                                        isChild={true}
                                                    />
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <SidebarItem
                                    key={menu.path || menu.name}
                                    icon={menu.icon}
                                    text={menu.name}
                                    active={menu.path ? location.pathname === menu.path : false}
                                    onClick={() => menu.path && navigate(menu.path)}
                                    isChild={false}
                                />
                            );
                        })}
                    </ul>
                </SidebarContext.Provider>
            </nav>
        </aside>
    );
}