import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { RootState, setSelectedStore } from "../../store";
import { PlanningData, SKU, Store } from "../../types";

// Define the data point interface for Recharts
interface ChartDataPoint {
  week: string;
  gmDollars: number;
  gmPercent: number;
}

const Charts = () => {
  const dispatch = useDispatch();
  const { stores, skus, planningData, selectedStore } = useSelector(
    (state: RootState) => state.app
  );
  const [storeFilter, setStoreFilter] = useState<string>(
    selectedStore || stores[0]?.id || ""
  );

  const chartData = useMemo((): ChartDataPoint[] => {
    const gmDollarsByWeek: { [key: string]: number } = {};
    const gmPercentByWeek: { [key: string]: number } = {};

    // Aggregate data for the selected store
    planningData.forEach((pd: PlanningData) => {
      if (pd.storeId === storeFilter) {
        const week = pd.weekId;
        gmDollarsByWeek[week] = (gmDollarsByWeek[week] || 0) + pd.gmDollars;

        const sku = skus.find((s: SKU) => s.id === pd.skuId);
        const salesDollars = pd.salesUnits * (sku?.price || 0);
        if (salesDollars > 0) {
          const gmPercent = (pd.gmDollars / salesDollars) * 100;
          gmPercentByWeek[week] = gmPercent || gmPercentByWeek[week] || 0;
        }
      }
    });

    // Generate 52 weeks of data, filling in zeros where no data exists
    const weeks = Array.from({ length: 52 }, (_, i) =>
      `W${(i + 1).toString().padStart(2, "0")}`
    );
    return weeks.map((week) => ({
      week,
      gmDollars: gmDollarsByWeek[week] || 0,
      gmPercent: gmPercentByWeek[week] || 0,
    }));
  }, [planningData, skus, storeFilter]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    setStoreFilter(storeId);
    dispatch(setSelectedStore(storeId));
  };

  return (
    <div className="p-5 bg-gray-200">
      <div className="p-4 bg-gray-800 h-full text-white">
        <div className="mb-4">
          <select
            value={storeFilter}
            onChange={handleStoreChange}
            className="p-2 bg-gray-700 text-white rounded"
          >
            {stores.map((store: Store) => (
              <option key={store.id} value={store.id}>
                {store.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ height: "600px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="week"
                stroke="#ffffff"
                interval="preserveStartEnd"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                stroke="#ffffff"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#ff9f40" // Orange for GM %
                tickFormatter={(value) => `${value}%`}
                domain={[0, 70]} // Match the max of 70 from your Chart.js version
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
              <Legend wrapperStyle={{ color: "#ffffff" }} />
              <Bar
                yAxisId="left"
                dataKey="gmDollars"
                name="GM Dollars"
                fill="rgba(54, 162, 235, 0.6)"
                barSize={20}
              />
              <Line
                yAxisId="right"
                dataKey="gmPercent"
                name="GM %"
                stroke="rgba(255, 159, 64, 1)"
                strokeWidth={2}
                dot={false} // Optional: remove dots for a cleaner line
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;