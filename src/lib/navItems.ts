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
        title: "Admins",
        href: "/admin/dashboard/admins-management",
        icon: "Shield",
      },
      {
        title: "Doctors",
        href: "/admin/dashboard/doctors-management",
        icon: "Stethoscope",
      },
      {
        title: "Patients",
        href: "/admin/dashboard/patients-management",
        icon: "Users",
      },
    ],
  },
  {
    title: "Ecosystem Management",
    items: [
      {
        title: "Idea Management",
        href: "/admin/dashboard/idea-managment",
        icon: "Calendar",
      },
      {
        title: "User Management",
        href: "/admin/dashboard/user-mangment",
        icon: "Clock",
      },
      //   {
      //     title: "Specialties",
      //     href: "/admin/dashboard/specialties-management",
      //     icon: "Hospital",
      //   },
      //   {
      //     title: "Doctor Schedules",
      //     href: "/admin/dashboard/doctor-schedules-managament",
      //     icon: "CalendarClock",
      //   },
      //   {
      //     title: "Doctor Specialties",
      //     href: "/admin/dashboard/doctor-specialties-management",
      //     icon: "Stethoscope",
      //   },
      {
        title: "Payments",
        href: "/admin/dashboard/payment-managment",
        icon: "CreditCard",
      },

      //   {
      //     title: "Prescriptions",
      //     href: "/admin/dashboard/prescriptions-management",
      //     icon: "FileText",
      //   },
      //   {
      //     title: "Reviews",
      //     href: "/admin/dashboard/reviews-management",
      //     icon: "Star",
      //   },
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
      {
        title: "Rejected Ideas",
        href: "/dashboard/rejected-idea",
        icon: "ClipboardList",
      },
    ],
  },
  {
    title: "",
    items: [
      {
        title: "Under Review Ideas",
        href: "/dashboard/under-review-idea",
        icon: "FileText",
      },
      {
        title: "Health Records",
        href: "/dashboard/health-records",
        icon: "Activity",
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
