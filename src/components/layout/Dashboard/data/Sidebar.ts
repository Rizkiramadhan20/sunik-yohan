import {
  Contact,
  MessageSquare,
  House,
  Users,
  User,
  FileText,
  LayoutDashboard,
  Building2,
  Newspaper,
} from "lucide-react";

export const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/dashboard/pages",
    label: "Pages",
    icon: FileText,
    subItems: [
      {
        href: "/dashboard/pages/home",
        label: "Home",
      },
      {
        href: "/dashboard/pages/about",
        label: "About",
      },
      {
        href: "/dashboard/pages/services",
        label: "Services",
      },
      {
        href: "/dashboard/pages/daily",
        label: "Daily",
      },
    ],
  },

  {
    href: "/dashboard/products",
    label: "Products",
    icon: Building2,
    subItems: [
      {
        href: "/dashboard/products/products",
        label: "products",
      },

      {
        href: "/dashboard/products/categories",
        label: "Category",
      },

      {
        href: "/dashboard/products/size",
        label: "Size",
      },
    ],
  },

  {
    href: "/dashboard/blog",
    label: "Blog",
    icon: Newspaper,
  },

  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },

  {
    href: "/dashboard/users",
    label: "Users",
    icon: Users,
  },

  {
    href: "/dashboard/contact",
    label: "Contact",
    icon: Contact,
  },

  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
  },
  {
    href: "/",
    label: "Back Home",
    icon: House,
  },
];
