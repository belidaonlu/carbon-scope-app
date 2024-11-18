import React from "react";
import { useEmissions } from "@/context/EmissionsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Search, FileDown } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const CategoryHeader = () => {
  const { selectedDate, searchTerm, setDate, setSearchTerm } = useEmissions();

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <h1 className="text-2xl font-bold">Sera Gazı Emisyon Kategorileri</h1>
      <div className="flex items-center gap-2">
        <DatePicker 
          date={selectedDate} 
          onChange={setDate} 
        />
        <SearchInput 
          value={searchTerm} 
          onChange={setSearchTerm} 
        />
        <ExportButton />
      </div>
    </div>
  );
};