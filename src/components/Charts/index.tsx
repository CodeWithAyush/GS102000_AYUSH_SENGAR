import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  LineController
} from "chart.js";
import React, { useMemo } from "react";
import { Chart } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { RootState, setSelectedStore } from "../../store";
import { PlanningData, SKU, Store } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const dispatch = useDispatch();
  const { stores, skus, planningData, selectedStore } = useSelector(
    (state: RootState) => state.app
  );
  const [storeFilter, setStoreFilter] = React.useState<string>(
    selectedStore || stores[0]?.id || ""
  );

  const weeks = useMemo(
    () =>
      Array.from(
        { length: 52 },
        (_, i) => `W${(i + 1).toString().padStart(2, "0")}`
      ),
    []
  );

  const chartData = useMemo((): ChartData<"bar", number[], string>=> {
    const gmDollarsByWeek = new Array(52).fill(0);
    const gmPercentByWeek = new Array(52).fill(0);

    planningData.forEach((pd: PlanningData) => {
      if (pd.storeId === storeFilter) {
        const weekIndex = parseInt(pd.weekId.replace("W", "")) - 1; 
        if (weekIndex >= 0 && weekIndex < 52) {
          gmDollarsByWeek[weekIndex] =
            (gmDollarsByWeek[weekIndex] || 0) + pd.gmDollars;

          const sku = skus.find((s: SKU) => s.id === pd.skuId);
          const salesDollars = pd.salesUnits * (sku?.price || 0);
          if (salesDollars > 0) {
            const gmPercent = (pd.gmDollars / salesDollars) * 100;
            gmPercentByWeek[weekIndex] =
              gmPercent || gmPercentByWeek[weekIndex] || 0;
          }
        }
      }
    });

    return {
      labels: weeks,
      datasets: [
        {
          type: "bar",
          label: "GM Dollars",
          data: gmDollarsByWeek,
          backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue bars
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
          yAxisID: "y-left",
        },
        {
          type: "bar" as const,
          label: "GM %",
          data: gmPercentByWeek,
          borderColor: "rgba(255, 159, 64, 1)", // Orange line
          backgroundColor: "rgba(255, 159, 64, 0.6)",
          borderWidth: 2,
          yAxisID: "y-right",
        },
      ],
    };
  }, [planningData, skus, storeFilter]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    setStoreFilter(storeId);
    dispatch(setSelectedStore(storeId));
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
        },
      },
      title: {
        display: true,
        text: "Gross Margin",
        color: "#ffffff",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      "y-left": {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "GM Dollars",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
          callback: (value: any) => `$${value.toLocaleString()}`,
        },
        beginAtZero: true,
      },
      "y-right": {
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "GM %",
          color: "#ffffff",
        },
        ticks: {
          color: "#ffffff",
          callback: (value: any) => `${value}%`,
        },
        beginAtZero: true,
        max: 70, 
      },
      x: {
        ticks: {
          color: "#ffffff",
        },
      },
    },
    maintainAspectRatio: false,
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
        <div style={{ position: "relative", height: "600px" }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
