import { Link } from "@/lib/router";
import { Menu } from "lucide-react";
import { useBreadcrumbs } from "../context/BreadcrumbContext";
import { useSidebar } from "../context/SidebarContext";
import { useCompany } from "../context/CompanyContext";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment, useMemo } from "react";
import { PluginSlotOutlet, usePluginSlots } from "@/plugins/slots";
import { PluginLauncherOutlet, usePluginLaunchers } from "@/plugins/launchers";

type GlobalToolbarContext = { companyId: string | null; companyPrefix: string | null };

const shellClasses =
  "border-b border-primary/20 bg-[linear-gradient(180deg,rgba(26,39,17,0.96),rgba(11,17,8,0.92))] shadow-[0_12px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl";

function GlobalToolbarPlugins({ context }: { context: GlobalToolbarContext }) {
  const { slots } = usePluginSlots({ slotTypes: ["globalToolbarButton"], companyId: context.companyId });
  const { launchers } = usePluginLaunchers({ placementZones: ["globalToolbarButton"], companyId: context.companyId, enabled: !!context.companyId });
  if (slots.length === 0 && launchers.length === 0) return null;
  return (
    <div className="ml-auto flex shrink-0 items-center gap-1.5 pl-3">
      <PluginSlotOutlet slotTypes={["globalToolbarButton"]} context={context} className="flex items-center gap-1" />
      <PluginLauncherOutlet placementZones={["globalToolbarButton"]} context={context} className="flex items-center gap-1" />
    </div>
  );
}

export function BreadcrumbBar() {
  const { breadcrumbs, mobileToolbar } = useBreadcrumbs();
  const { toggleSidebar, isMobile } = useSidebar();
  const { selectedCompanyId, selectedCompany } = useCompany();

  const globalToolbarSlotContext = useMemo(
    () => ({
      companyId: selectedCompanyId ?? null,
      companyPrefix: selectedCompany?.issuePrefix ?? null,
    }),
    [selectedCompanyId, selectedCompany?.issuePrefix],
  );

  const globalToolbarSlots = <GlobalToolbarPlugins context={globalToolbarSlotContext} />;

  if (isMobile && mobileToolbar) {
    return (
      <div className={`${shellClasses} flex h-12 shrink-0 items-center px-2`}>
        {mobileToolbar}
      </div>
    );
  }

  if (breadcrumbs.length === 0) {
    return (
      <div className={`${shellClasses} flex h-14 shrink-0 items-center justify-end px-4 md:px-6`}>
        {globalToolbarSlots}
      </div>
    );
  }

  const menuButton = isMobile && (
    <Button
      variant="outline"
      size="icon-sm"
      className="mr-1 shrink-0 border-primary/20 bg-background/35 text-primary hover:bg-primary/10"
      onClick={toggleSidebar}
      aria-label="Open sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );

  // Single breadcrumb = page title (uppercase)
  if (breadcrumbs.length === 1) {
    return (
      <div className={`${shellClasses} flex h-14 shrink-0 items-center px-4 md:px-6`}>
        {menuButton}
        <div className="min-w-0 overflow-hidden flex-1">
          <h1 className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/90">
            {breadcrumbs[0].label}
          </h1>
        </div>
        {globalToolbarSlots}
      </div>
    );
  }

  // Multiple breadcrumbs = breadcrumb trail
  return (
    <div className={`${shellClasses} flex h-14 shrink-0 items-center px-4 md:px-6`}>
      {menuButton}
      <div className="min-w-0 overflow-hidden flex-1">
        <Breadcrumb className="min-w-0 overflow-hidden">
          <BreadcrumbList className="flex-nowrap">
            {breadcrumbs.map((crumb, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <Fragment key={i}>
                  {i > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem className={isLast ? "min-w-0" : "shrink-0"}>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={crumb.href}>{crumb.label}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {globalToolbarSlots}
    </div>
  );
}
