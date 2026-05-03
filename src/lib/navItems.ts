import { NavSection } from "@/types/dashboard.type";
import { getDashboardRoute, UserRole } from "./authUtiles";

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDashboardRoute(role);
  return [
    {
      items: [
        {
          title: "Home",
          href: "/",
          icon: "Home",
        },
        {
          title: "Dashboard",
          href: defaultDashboard,
          icon: "Dashboard",
        },
        {
          title: "My Profile",
          href: "/my-profile",
          icon: "User",
        },
      ],
    },
    {
      title: "Settings",
      items: [
        {
          title: "Change Password",
          href: "/change-password",
          icon: "Lock",
        },
      ],
    },
  ];
};

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      {
        title: "User Management",
        href: "/admin/dashboard/user-mangment",
        icon: "Clock",
      },
    ],
  },

  {
    title: "Blog Management",
    items: [
      {
        title: "Create Blog",
        href: "/admin/dashboard/blog-create",
        icon: "FileText",
      },
    ],
  },
  {
    items: [
      {
        title: "Delete Blog",
        href: "/admin/dashboard/delete-blog",
        icon: "FileText",
      },
    ],
  },

  {
    title: "Ecosystem Management",
    items: [
      {
        title: "Ideas",
        href: "/admin/dashboard/idea-managment",
        icon: "Calendar",
      },
    ],
  },
  {
    items: [
      {
        title: "Rejected Ideas",
        href: "/admin/dashboard/rejected-idea",
        icon: "ClipboardList",
      },
    ],
  },
  // {
  //   title: "Approved Ideas",
  //   items: [
  //     {
  //       title: "Approved Ideas",
  //       href: "/admin/dashboard/selected-idea",
  //       icon: "Calendar",
  //     },
  //   ],
  // },
  {
    items: [
      {
        title: "Under Review Ideas",
        href: "/admin/dashboard/under-review-idea",
        icon: "FileText",
      },
    ],
  },
  {
    title: "Payment Managment",
    items: [
      {
        title: "Payments",
        href: "/admin/dashboard/payment-managment",
        icon: "CreditCard",
      },
    ],
  },
];

export const userNavItems: NavSection[] = [
  {
    title: "Ideas world",
    items: [
      {
        title: "Create Idea",
        href: "/dashboard/create-idea",
        icon: "Calendar",
      },
      {
        title: "Approved Ideas",
        href: "/dashboard/selected-idea",
        icon: "Calendar",
      },
    ],
  },
  {
    title: "Idea Monitoring",
    items: [
      {
        title: "Under Review Ideas",
        href: "/dashboard/under-review-idea",
        icon: "FileText",
      },
      {
        title: "Rejected Ideas",
        href: "/dashboard/rejected-idea",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "Purchased Ideas",
    items: [
      {
        title: "Purchased Ideas",
        href: "/dashboard/purchesed-idea",
        icon: "FileText",
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...commonNavItems, ...adminNavItems];

    case "USER":
      return [...commonNavItems, ...userNavItems];

    default:
      return commonNavItems;
  }
};
