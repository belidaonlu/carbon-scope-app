// src/hooks/useEmissionCalculations.js
import { useMemo } from 'react';
import { format, subMonths, isSameMonth } from 'date-fns';
import { EMISSION_FACTORS } from '@/constants/emissionFactors';

export const useEmissionCalculations = (entries, selectedDate) => {
  return useMemo(() => {
    // Temel hesaplama yapısını oluştur
    const calculations = {
      byScope: {
        scope1: { total: 0, categories: {}, monthlyData: [] },
        scope2: { total: 0, categories: {}, monthlyData: [] },
        scope3: { total: 0, categories: {}, monthlyData: [] }
      },
      total: 0,
      monthlyTrend: [],
      sourceDistribution: [],
      topEmitters: []
    };

    // Seçili ayın verilerini filtrele
    const currentMonthEntries = entries.filter(entry => 
      isSameMonth(new Date(entry.date), selectedDate)
    );

    // Son 12 ay için aylık trend verilerini hazırla
    const last12Months = Array.from({ length: 12 }, (_, i) => ({
      date: subMonths(selectedDate, i),
      emissions: 0
    }));

    entries.forEach(entry => {
      const { scopeKey, subKey, source } = entry;
      let emissionAmount = 0;

      // Emisyon hesaplama
      switch(scopeKey) {
        case 'scope1':
          emissionAmount = calculateScope1Emissions(entry);
          break;
        case 'scope2':
          emissionAmount = calculateScope2Emissions(entry);
          break;
        case 'scope3':
          emissionAmount = calculateScope3Emissions(entry);
          break;
      }

      // Kapsam bazlı toplama
      if (!calculations.byScope[scopeKey].categories[subKey]) {
        calculations.byScope[scopeKey].categories[subKey] = {
          total: 0,
          sources: {}
        };
      }

      calculations.byScope[scopeKey].categories[subKey].total += emissionAmount;
      
      // Kaynak bazlı dağılım
      if (!calculations.byScope[scopeKey].categories[subKey].sources[source]) {
        calculations.byScope[scopeKey].categories[subKey].sources[source] = 0;
      }
      calculations.byScope[scopeKey].categories[subKey].sources[source] += emissionAmount;

      // Kapsam toplamlarını güncelle
      calculations.byScope[scopeKey].total += emissionAmount;

      // Toplam emisyonu güncelle
      calculations.total += emissionAmount;

      // Aylık trend verilerini güncelle
      const monthIndex = last12Months.findIndex(month => 
        isSameMonth(new Date(entry.date), month.date)
      );
      if (monthIndex !== -1) {
        last12Months[monthIndex].emissions += emissionAmount;
      }
    });

    // En yüksek emisyon kaynaklarını bul
    calculations.topEmitters = Object.entries(calculations.byScope)
      .flatMap(([scopeKey, scope]) => 
        Object.entries(scope.categories).map(([categoryKey, category]) => 
          Object.entries(category.sources).map(([source, amount]) => ({
            scope: scopeKey,
            category: categoryKey,
            source,
            amount
          }))
        ).flat()
      )
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    // Kaynak dağılımını hazırla
    calculations.sourceDistribution = Object.entries(calculations.byScope)
      .map(([scope, data]) => ({
        name: scope,
        value: data.total,
        percentage: (data.total / calculations.total * 100).toFixed(1)
      }));

    // Aylık trend verilerini formatla
    calculations.monthlyTrend = last12Months
      .reverse()
      .map(month => ({
        name: format(month.date, 'MMM yy'),
        value: Number((month.emissions / 1000).toFixed(2)) // ton CO2e
      }));

    return calculations;
  }, [entries, selectedDate]);
};

// Kapsam 1 emisyon hesaplama fonksiyonu
const calculateScope1Emissions = (entry) => {
  const { subKey, fuelType, consumption, amount, refrigerantType, unit } = entry;
  let emissions = 0;

  switch(subKey) {
    case 'stationaryCombustion':
      emissions = consumption * EMISSION_FACTORS.scope1.stationaryCombustion[fuelType].factor;
      break;
    case 'mobileCombustion':
      emissions = consumption * EMISSION_FACTORS.scope1.mobileCombustion[fuelType].factor;
      break;
    case 'fugitiveEmissions':
      emissions = amount * EMISSION_FACTORS.scope1.fugitiveEmissions[refrigerantType].factor;
      break;
  }

  // Birim dönüşümleri
  if (unit === 'MWh') emissions *= 1000; // MWh to kWh
  if (unit === 'ton') emissions *= 1000; // ton to kg

  return emissions;
};

// Kapsam 2 emisyon hesaplama fonksiyonu
const calculateScope2Emissions = (entry) => {
  const { subKey, consumption, unit } = entry;
  let emissions = 0;

  switch(subKey) {
    case 'electricity':
      emissions = consumption * EMISSION_FACTORS.scope2.electricity.default.factor;
      break;
    case 'heating':
      emissions = consumption * EMISSION_FACTORS.scope2.heating.default.factor;
      break;
  }

  // Birim dönüşümleri
  if (unit === 'MWh') emissions *= 1000; // MWh to kWh

  return emissions;
};

// Kapsam 3 emisyon hesaplama fonksiyonu
const calculateScope3Emissions = (entry) => {
  const { subKey, distance, amount, disposalMethod, passengers, workingDays, employeeCount } = entry;
  let emissions = 0;

  switch(subKey) {
    case 'businessTravel':
      emissions = distance * EMISSION_FACTORS.scope3.businessTravel[entry.source].factor * (passengers || 1);
      break;
    case 'employeeCommuting':
      emissions = distance * EMISSION_FACTORS.scope3.employeeCommuting.default.factor * 
                 (employeeCount || 1) * (workingDays || 1);
      break;
    case 'wasteDisposal':
      emissions = amount * EMISSION_FACTORS.scope3.wasteDisposal[disposalMethod].factor;
      break;
  }

  return emissions;
};

// EmissionSummary bileşeni güncellenmiş versiyon
export const EmissionSummary = () => {
  const { entries, selectedDate } = useEmissions();
  const calculations = useEmissionCalculations(entries, selectedDate);

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="summary">Genel Özet</TabsTrigger>
        <TabsTrigger value="details">Detaylı Analiz</TabsTrigger>
      </TabsList>

      <TabsContent value="summary" className="space-y-4">
        <SummaryCard>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Emisyon Özeti - {format(selectedDate, 'MMMM yyyy', { locale: tr })}
              </CardTitle>
              <div className="text-2xl font-bold">
                {(calculations.total / 1000).toFixed(2)} ton CO2e
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Sol taraf - Sayısal veriler */}
              <div className="space-y-4">
                <ScopeBreakdown data={calculations.byScope} />
                <TopEmitters data={calculations.topEmitters} />
              </div>

              {/* Sağ taraf - Grafikler */}
              <div className="space-y-4">
                <EmissionPieChart data={calculations.sourceDistribution} />
                <EmissionTrendChart data={calculations.monthlyTrend} />
              </div>
            </div>
          </CardContent>
        </SummaryCard>
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

// Grafik bileşenleri
const EmissionPieChart = ({ data }) => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label={({ name, percentage }) => `${name} (${percentage}%)`}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={['#0088FE', '#00C49F', '#FFBB28'][index % 3]} 
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${(value / 1000).toFixed(2)} ton CO2e`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const EmissionTrendChart = ({ data }) => (
  <div className="h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis unit=" ton" />
        <Tooltip formatter={(value) => `${value} ton CO2e`} />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);