import {
  Contact,
  MessageSquare,
  House,
  Users,
  FileText,
  LayoutDashboard,
  Building2,
  Newspaper,
  Images,
  UserRoundPen,
  CircleUserRound,
  ArrowLeftRight,
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

      {
        href: "/dashboard/products/banner",
        label: "Banner",
      },
    ],
  },

  {
    href: "/dashboard/blog",
    label: "Blog",
    icon: Newspaper,
  },

  {
    href: "/dashboard/gallery",
    label: "Gallery",
    icon: Images,
  },

  {
    href: "/dashboard/transaksi",
    label: "Transaksi",
    icon: ArrowLeftRight,
    subItems: [
      {
        href: "/dashboard/transaksi/transaksi",
        label: "Transaksi",
      },

      {
        href: "/dashboard/transaksi/pending",
        label: "Pending",
      },

      {
        href: "/dashboard/transaksi/delivery",
        label: "Delivery",
      },

      {
        href: "/dashboard/transaksi/success",
        label: "Success",
      },
    ],
  },

  {
    href: "/dashboard/testimonials",
    label: "Testimonials",
    icon: Users,
  },

  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: UserRoundPen,
  },

  {
    href: "/dashboard/users",
    label: "Users",
    icon: CircleUserRound,
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
