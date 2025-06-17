import { FaUser, FaWpforms, FaMoneyCheckAlt, FaHome, FaUsers } from "react-icons/fa";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
// import { MdAdminPanelSettings } from "react-icons/md";
import { SiGoogleforms } from "react-icons/si";
import { IoReceiptOutline } from "react-icons/io5"; // Import the icon you want to use

export const USER_LINKS = [
    {
        key: "Profile",
        label: "Profile",
        Path: "/user/profile",
        icon: FaUser, // Pass the icon as a component
    },
    {
        key: "Form",
        label: "Application Form",
        Path: "/user/form",
        icon: FaWpforms, // Pass the icon as a component
    },
    {
        key: "ClaimAmount",
        label: "Claim Amount",
        Path: "/user/claim-amt",
        icon: FaMoneyCheckAlt
        , // Pass the icon as a component
    },
    {
        key: "Receipt",
        label: "Receipt",
        Path: "/user/receipt",
        icon :IoReceiptOutline
    },
    {
        key: "Transactions",
        label: "Transactions",
        Path: "/user/transactions",
        icon: RiMoneyRupeeCircleLine, // Pass the icon as a component
    },
];

export const SUBADMIN_LINKS = [
    {
        key: "Profile",
        label: "Profile",
        Path: "/sub-admin/profile",
        icon: FaUser,
    },
    {
        key: "ViewUsers",
        label: "View Users",
        Path: "/sub-admin/view-users",
        icon: FaUsers,
    },
    // Manage applications
    {
        key: "ManageApplications",
        label: "Manage Applications",
        Path: "/sub-admin/manage-applications",
        icon: SiGoogleforms,
    },
];

export const ADMIN_LINKS = [
    {
        key: "Profile",
        label: "Profile",
        Path: "/admin/profile",
        icon: FaUser,
    },
    {
        key: "ManageUsers",
        label: "Manage Sub-Admins",
        Path: "/admin/manage-users",
        icon: FaUsers,
    },
    {
        key: "ShowApplications",
        label: "Show Applications",
        Path: "/admin/show-applications",
        icon: SiGoogleforms,
    },
];
