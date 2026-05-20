import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import React, { useMemo } from "react";

type MatchType = {
  pathname: string;
  data?: any;
  params?: Record<string, string>;
  handle?: {
    crumb: any;
  };
};

type BreadCrumbLayoutProps = {
  matches: MatchType[];
};

export default function BreadCrumbLayout({ matches }: BreadCrumbLayoutProps) {
  const location = useLocation();

  const crumbs = useMemo(() => {
    return matches
      .filter((match) => match.handle?.crumb)
      .flatMap((match, index, filteredArray) => {
        const isLastMatch = index === filteredArray.length - 1;

        const raw = typeof match.handle!.crumb === "function"
          ? match.handle!.crumb({
            data: match.data,
            params: match.params,
            location: location,
          })
          : match.handle!.crumb;

        // Standardize labels into array of objects
        let labelArray: Array<{ label: string; href?: string }> = [];
        if (Array.isArray(raw)) {
          labelArray = raw.map((l) => (typeof l === "string" ? { label: l } : l));
        } else {
          labelArray = [{ label: String(raw) }];
        }

        return labelArray.map((item, i) => ({
          label: item.label,
          href: item.href || match.pathname,
          isLast: isLastMatch && i === labelArray.length - 1,
          key: `crumb-${match.pathname}-${index}-${i}-${item.label}`,
        }));
      });
  }, [matches, location]);

  return (
    <Breadcrumb className="min-w-0 flex-1">
      <BreadcrumbList className="flex-nowrap">
        {/* Static Home Link */}
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink asChild>
            <Link to="/">Amuze</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((item) => (
          <React.Fragment key={item.key}>
            <BreadcrumbSeparator className="shrink-0"/>
            <BreadcrumbItem className="min-w-0">
              {item.isLast ? (
                <BreadcrumbPage>
                  <span className="block truncate max-w-[120px] sm:max-w-[180px] md:max-w-[240px]">
                    {typeof item.label === "string" ? item.label : "Details"}
                  </span>
                </BreadcrumbPage>


              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href} state={location?.state} className="block truncate max-w-[80px] sm:max-w-[120px]">
                    <span>{typeof item.label === "string" ? item.label : "Back"}</span>
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}