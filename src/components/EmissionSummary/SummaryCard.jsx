import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScopeAccordion } from './ScopeAccordion';
import { EmissionCharts } from './EmissionCharts';

export const SummaryCard = ({ calculations, selectedDate }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            Emisyon Özeti - {format(selectedDate, 'MMMM yyyy', { locale: tr })}
          </CardTitle>
          <MonthPicker 
            selectedDate={selectedDate} 
            minDate={new Date(2020, 0)} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <ScopeAccordion calculations={calculations} />
          <EmissionCharts calculations={calculations} />
        </div>
      </CardContent>
    </Card>
  );
};