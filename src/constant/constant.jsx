import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Settings,
  FileText,
  MapPin,
} from "lucide-react";

let CONSTANT = {};

CONSTANT.BASE_URL = "http://localhost:5000";
CONSTANT.CLOUDINARY_BASE_URL = "https://res.cloudinary.com/your-cloud-name/image/upload";

CONSTANT.MENUS = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <Home className="w-5 h-5" />,
    // No permission = always show
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <ShoppingCart className="w-5 h-5" />,
    permission: "Orders", // only show if "Orders" is in localStorage modules
  },
  {
    name: "Products",
    icon: <Package className="w-5 h-5" />,
    permission: "Products",
    children: [
      {
        name: "All Products",
        path: "/products",
        icon: <Package className="w-4 h-4" />,
      },
      {
        name: "Add Product",
        path: "/products/add",
        icon: <Package className="w-4 h-4" />,
      },
    ],
  },
  {
    name: "Locations",
    path: "/locations",
    icon: <MapPin className="w-5 h-5" />,
    permission: "Locations",
  },
  {
    name: "Users",
    path: "/users",
    icon: <Users className="w-5 h-5" />,
    permission: "Users",
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FileText className="w-5 h-5" />,
    permission: "Reports",
  },
  {
    name: "Settings",
    path: "/settings",
    icon: <Settings className="w-5 h-5" />,
    // No permission = always show
  },
];

export default CONSTANT;