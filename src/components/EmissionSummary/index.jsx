import React from 'react';
import { useEmissions } from "@/context/EmissionsContext";
import { SummaryTabs } from './SummaryTabs';
import { SummaryCard } from './SummaryCard';
import { DetailedAnalysis } from './DetailedAnalysis';
import { useEmissionCalculations } from '@/hooks/useEmissionCalculations';

const EmissionSummary = () => {
  const { entries, selectedDate } = useEmissions();
  const calculations = useEmissionCalculations(entries, selectedDate);

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary">Genel Özet</TabsTrigger>
        <TabsTrigger value="details">Detaylı Analiz</TabsTrigger>
      </TabsList>

      <TabsContent value="summary">
        <SummaryCard 
          calculations={calculations} 
          selectedDate={selectedDate} 
        />
      </TabsContent>

      <TabsContent value="details">
        <DetailedAnalysis 
          calculations={calculations} 
          selectedDate={selectedDate} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default EmissionSummary;