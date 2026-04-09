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

  // 1. Memoize calculation to prevent infinite re-renders
  const crumbs = useMemo(() => {
    return matches
      .filter((match) => match.handle?.crumb)
      .flatMap((match, index, filteredArray) => {
        const isLastMatch = index === filteredArray.length - 1;

        // 2. Pass 'location' so handle can access location.state
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
          // 3. Unique key including label prevents 'insertBefore' DOM crash
          key: `crumb-${match.pathname}-${index}-${i}-${item.label}`,
        }));
      });
  }, [matches, location]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Static Home Link */}
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Amuze</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((item) => (
          <React.Fragment key={item.key}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>
                  <span className="max-w-50 truncate block">
                    {typeof item.label === "string" ? item.label : "Details"}
                  </span>
                </BreadcrumbPage>


              ) : (
                <BreadcrumbLink asChild>
                  <Link to={item.href} state={location?.state}>
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