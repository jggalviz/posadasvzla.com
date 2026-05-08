import React from "react";
import OwnerDashboardClient from "./OwnerDashboardClient";

export const metadata = { title: "Mi Panel | PosadasVzla" };
export const dynamic = "force-dynamic";

export default function OwnerDashboardPage() {
  return <OwnerDashboardClient />;
}
