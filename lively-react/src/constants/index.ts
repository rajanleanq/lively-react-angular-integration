//constants
import { Dashboard, Inventory, CalendarMonth } from "@mui/icons-material";
import { AdminTab } from "../types";

export const adminTabs = [
  { id: "dashboard" as AdminTab, label: "Dashboard", icon: Dashboard },
  { id: "items" as AdminTab, label: "Manage Items", icon: Inventory },
  { id: "summary" as AdminTab, label: "Monthly Summary", icon: CalendarMonth },
];
