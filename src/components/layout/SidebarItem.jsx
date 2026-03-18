import { useSidebar } from "./SidebarContext";

export default function SidebarItem({ icon, text, active, alert, onClick, isChild }) {
    const { expanded } = useSidebar();

    return (
        <li
            onClick={onClick}
            className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"}
        ${isChild ? "text-xs" : "text-sm"}
      `}
            role="menuitem"
            aria-current={active ? "page" : undefined}
        >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>
                {text}
            </span>
            {alert && (
                <div
                    className={`absolute right-2 w-2 h-2 rounded-full bg-indigo-400 ${expanded ? "" : "top-2"}`}
                />
            )}
            {!expanded && (
                <div
                    className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            hidden group-hover:block
          `}
                >
                    {text}
                </div>
            )}
        </li>
    );
}