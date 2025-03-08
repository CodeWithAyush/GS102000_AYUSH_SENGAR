import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import { CellValueChangedEvent, ClientSideRowModelModule, ColDef, ColGroupDef } from "ag-grid-community";
import { RootState, updatePlanningData } from "../../store";
import { Row } from "../../types/index";

const Planning = () => {
  const dispatch = useDispatch();
  const { stores, skus, calendar, planningData } = useSelector((state: RootState) => state.app);
  const allWeeks = useMemo(() => calendar.flatMap(month => month.weeks), [calendar]);

  const rowData = useMemo(() => {
    return stores.flatMap(store =>
      skus.map(sku => {
        const row:Row = {
          store: store.label,
          sku: sku.label,
        };
        const price = sku.price || 0; 
        const cost = sku.cost || 0;   

        allWeeks.forEach(week => {
          const pd = planningData.find(p => p.storeId === store.id && p.skuId === sku.id && p.weekId === week.week);
          const salesUnits = pd ? pd.salesUnits : 0;
          const salesDollars = salesUnits * price;
          const gmDollars = salesUnits * (price - cost);
          const gmPercent = price > 0 ? ((price - cost) / price * 100) : 0;

          row[`${week.week}_salesUnits`] = salesUnits;
          row[`${week.week}_salesDollars`] = salesDollars;
          row[`${week.week}_gmDollars`] = gmDollars;
          row[`${week.week}_gmPercent`] = gmPercent;
        });

        return row;
      })
    );
  }, [stores, skus, allWeeks, planningData]);

  const columnDefs = useMemo ((): (ColDef<Row> | ColGroupDef<Row>)[] =>{
    const weekColumns = allWeeks.map(week => ({
      headerName: `${week.weekLabel} (${week.monthLabel})`,
      children: [
        {
          headerName: "Sales Units",
          field: `${week.week}_salesUnits`,
          editable: true,
          valueFormatter: (params: { value: number; }) => params.value.toFixed(0),
          sortable: true,
        },
        {
          headerName: "Sales Dollars",
          field: `${week.week}_salesDollars`,
          valueFormatter: (params: { value: number; }) => `$${params.value.toFixed(2)}`,
        },
        {
          headerName: "GM Dollars",
          field: `${week.week}_gmDollars`,
          valueFormatter: (params: { value: number; }) => `$${params.value.toFixed(2)}`,
        },
        {
          headerName: "GM Percent",
          field: `${week.week}_gmPercent`,
          valueFormatter: (params: { value: number; }) => `${params.value.toFixed(2)}%`,
          cellStyle: (params: { value: number; }) => {
            const value = params.value || 0;
            if (value >= 40) return { backgroundColor: "green", color: "white" };
            if (value >= 10) return { backgroundColor: "yellow" };
            if (value > 5) return { backgroundColor: "orange" };
            return { backgroundColor: "pink", color: "white" };
          },
        },
      ],
    }));

    return [
      { headerName: "Store", field: "store", sortable: true },
      { headerName: "SKU", field: "sku", sortable: true },
      ...weekColumns,
    ];
  }, [allWeeks]);

  const onCellValueChanged = (params: CellValueChangedEvent<Row>) => {
    if (params.colDef.field?.endsWith("_salesUnits")) {
      const weekId = params.colDef.field.split("_")[0];
      const salesUnits = parseInt(params.newValue) || 0;
      const store = stores.find(s => s.label === params.data.store);
      const sku = skus.find(s => s.label === params.data.sku);

      if (store && sku) {
        dispatch(
          updatePlanningData({
            storeId: store.id,
            skuId: sku.id,
            weekId,
            salesUnits,
          })
        );
      }
    }
  };

  return (
    <div className="h-full bg-gray-200 p-5">
      <div className="ag-theme-alpine" style={{ height: "calc(100% )", width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
          modules={[ClientSideRowModelModule]}
          defaultColDef={{ resizable: true }}
          // enableCellChangeFlash={true}
        />
      </div>
    </div>
  );
};

export default Planning;