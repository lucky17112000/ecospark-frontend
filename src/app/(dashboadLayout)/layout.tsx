import React from "react";

const RootDashboardlayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* dashboardsidebar */}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* dashboard navbar */}

        {/* dashboard content area */}
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default RootDashboardlayout;
