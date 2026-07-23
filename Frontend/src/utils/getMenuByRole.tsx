import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PaymentsIcon from "@mui/icons-material/Payments";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupsIcon from "@mui/icons-material/Groups";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SyncIcon from "@mui/icons-material/Sync";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckListIcon from "@mui/icons-material/Checklist";
import type { JSX } from "react/jsx-runtime";

const getmenuByRole = (role: string) => {
  const menus: Record<
    string,
    { name: string; path: string; icon: JSX.Element }[]
  > = {
    ADMIN: [
      { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
      { name: "Employees", path: "/admin/employees", icon: <PeopleIcon /> },
      {
        name: "Departments",
        path: "/admin/department",
        icon: <ApartmentIcon />,
      },
      { name: "Payroll", path: "/admin/payroll", icon: <PaymentsIcon /> },
      {
        name: "Employee Attendance",
        path: "/admin/employees/attendance",
        icon: <FactCheckIcon />,
      },
      {
        name: "Update Requests",
        path: "/admin/update-requests",
        icon: <SyncIcon />,
      },
      {
        name: "Employee Leaves",
        path: "/admin/employees/leaves",
        icon: <EventBusyIcon />,
      },
      {
        name: "Employee Tasks",
        path: "/admin/employees/tasks",
        icon: <AssignmentIcon />,
      },
    ],
    MANAGER: [
      {
        name: "Dashboard",
        path: "/manager/dashboard",
        icon: <DashboardIcon />,
      },
      { name: "My Team", path: "/manager/employees", icon: <PeopleIcon /> },
      { name: "Payroll", path: "/manager/payroll", icon: <PaymentsIcon /> },
      {
        name: "Attendance",
        path: "/manager/attendance",
        icon: <FactCheckIcon />,
      },
      {
        name: "Team Attendance",
        path: "/manager/employees/attendance",
        icon: <EventAvailableIcon />,
      },
      { name: "Leaves", path: "/manager/leaves", icon: <EventBusyIcon /> },
      {
        name: "Team Leaves",
        path: "/manager/employees/leaves",
        icon: <GroupsIcon />,
      },
      { name: "Tasks", path: "/manager/tasks", icon: <AssignmentIcon /> },
      {
        name: "Update Requests",
        path: "/employee/update-requests",
        icon: <SyncIcon />,
      },
      {
        name: "Team Tasks",
        path: "/manager/employees/tasks",
        icon: <CheckListIcon />,
      },
    ],
    EMPLOYEE: [
      {
        name: "Dashboard",
        path: "/employee/dashboard",
        icon: <DashboardIcon />,
      },
      { name: "Payroll", path: "/employee/payroll", icon: <PaymentsIcon /> },
      {
        name: "Attendance",
        path: "/employee/attendance",
        icon: <FactCheckIcon />,
      },
      { name: "Leaves", path: "/employee/leaves", icon: <EventBusyIcon /> },
      {
        name: "Update Requests",
        path: "/employee/update-requests",
        icon: <EventAvailableIcon />,
      },
      { name: "Tasks", path: "/employee/tasks", icon: <AssignmentIcon /> },
    ],
  };
  return menus[role];
};
export default getmenuByRole;
