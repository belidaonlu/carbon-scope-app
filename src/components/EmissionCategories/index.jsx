import React, { useMemo } from "react";
import { useEmissions } from "@/context/EmissionsContext";
import { CategoryHeader } from "./CategoryHeader";
import { CategoryList } from "./CategoryList";
import { EmissionSummary } from "../EmissionSummary";
import { SuccessMessage } from "./SuccessMessage";
import { CATEGORIES } from "@/constants/categories";

const EmissionCategories = () => {
  const { entries, searchTerm, selectedDate } = useEmissions();

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return CATEGORIES;

    const filtered = {};
    Object.entries(CATEGORIES).forEach(([scopeKey, scope]) => {
      const matchingSubcats = {};
      Object.entries(scope.subcategories).forEach(([subKey, subcat]) => {
        if (
          subcat.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subcat.sources.some((source) =>
            source.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) {
          matchingSubcats[subKey] = subcat;
        }
      });
      if (Object.keys(matchingSubcats).length > 0) {
        filtered[scopeKey] = {
          ...scope,
          subcategories: matchingSubcats,
        };
      }
    });
    return filtered;
  }, [searchTerm]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <CategoryHeader />
      <SuccessMessage />
      <CategoryList categories={filteredCategories} />
      {entries.length > 0 && <EmissionSummary />}
    </div>
  );
};

export default EmissionCategories;