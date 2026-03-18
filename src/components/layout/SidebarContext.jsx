import { createContext, useContext } from "react"

export const SidebarContext = createContext({ expanded: true })

export const useSidebar = () => useContext(SidebarContext)
