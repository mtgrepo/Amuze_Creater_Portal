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

  // 1. Grab the saved search parameters if they exist in state
  const preservedSearch = location.state?.fromSearch || "";

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

        let labelArray: Array<{ label: string; href?: string }> = [];
        if (Array.isArray(raw)) {
          labelArray = raw.map((l) => (typeof l === "string" ? { label: l } : l));
        } else {
          labelArray = [{ label: String(raw) }];
        }

        return labelArray.map((item, i) => {
          const baseHref = item.href || match.pathname;

          // const cleanBaseHref = baseHref.replace(/\/$/, "");
          // const cleanLocationPath = location.pathname.replace(/\/$/, "");
          
          // const dynamicHref = 
          //   preservedSearch && !isLastMatch && cleanLocationPath.includes(cleanBaseHref)
          //     ? `${baseHref}${preservedSearch}`
          //     : baseHref;

          return {
            label: item.label,
            href: baseHref,
            isLast: isLastMatch && i === labelArray.length - 1,
            key: `crumb-${match.pathname}-${index}-${i}-${item.label}`,
          };
        });
      });
  }, [matches, location, preservedSearch]); 

  return (
    <Breadcrumb>
      <BreadcrumbList>
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
                  <span className="max-w-50 truncate block py-1">
                    {typeof item.label === "string" ? item.label : "Details"}
                  </span>
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={`${item.href}${location.state?.fromSearch ?? ""}`} state={location.state}>
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