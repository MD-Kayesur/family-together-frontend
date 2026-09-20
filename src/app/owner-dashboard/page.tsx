"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import SanctuaryDashboardWrapper, {
  normalizeDashboardTab,
} from "@/components/dashboard/SanctuaryDashboardWrapper";
import ViewerDashboardPage from "./viewer/page";

// Tab Components
import OverviewTab from "@/components/dashboard/tabs/OverviewTab";
import UsersTab from "@/components/dashboard/tabs/UsersTab";
import FamilyTab from "@/components/dashboard/tabs/FamilyTab";
import TreeTab from "@/components/dashboard/tabs/TreeTab";
import MembersTab from "@/components/dashboard/tabs/MembersTab";
import RelationshipsTab from "@/components/dashboard/tabs/RelationshipsTab";
import MemoriesTab from "@/components/dashboard/tabs/MemoriesTab";
import EventsTab from "@/components/dashboard/tabs/EventsTab";
import DocumentsTab from "@/components/dashboard/tabs/DocumentsTab";
import InvitationsTab from "@/components/dashboard/tabs/InvitationsTab";
import SettingsTab from "@/components/dashboard/tabs/SettingsTab";
import MessagesTab from "@/components/dashboard/tabs/MessagesTab";

function OwnerDashboardContent() {
  const searchParams = useSearchParams();
  const rawTab = searchParams?.get("tab");
  const tab = normalizeDashboardTab(rawTab);

  switch (tab) {
    case "users":
      return <UsersTab />;
    case "family":
      return <FamilyTab />;
    case "tree":
      return <TreeTab />;
    case "members":
      return <MembersTab />;
    case "relationships":
      return <RelationshipsTab />;
    case "messages":
      return <MessagesTab role="OWNER" />;
    case "memories":
      return <MemoriesTab />;
    case "events":
      return <EventsTab />;
    case "documents":
      return <DocumentsTab />;
    case "invitations":
      return <InvitationsTab />;
    case "settings":
      return <SettingsTab />;
    case "dashboard":
    default:
      return <OverviewTab />;
  }
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Render Viewer Sanctuary Dashboard for VIEWER role
  if (user?.role?.toUpperCase() === "VIEWER") {
    return <ViewerDashboardPage />;
  }

  return (
    <SanctuaryDashboardWrapper>
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12 text-slate-400">
            <span className="h-6 w-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mr-3" />
            <span>Loading sanctuary tab...</span>
          </div>
        }
      >
        <OwnerDashboardContent />
      </Suspense>
    </SanctuaryDashboardWrapper>
  );
}
