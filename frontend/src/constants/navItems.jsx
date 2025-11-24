import {
  Home,
  Search,
  Settings,
  SquarePlus,
  User,
} from "lucide-react";

export const navItems = [
    { id: 1, label: "Home", link: "/", icon: Home },
    { id: 2, label: "Profile", link: "/profile", icon: User },
    { id: 3, label: "Create Post", link: "/createPost", icon: SquarePlus },
    { id: 4, label: "Settings", link: "/settings", icon: Settings },
    { id: 5, label: "Search", link: "/search", icon: Search },
  ];
