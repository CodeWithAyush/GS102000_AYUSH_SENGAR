import { ColDef } from "ag-grid-community";
import { Month } from "../types";

export const generateColumnDefs = (calendar: Month[]): ColDef[] => {
  return [
    {
      headerName: "Store",
      field: "store.label",
      pinned: "left",
      width: 200,
    },
    {
      headerName: "SKU",
      field: "sku.label",
      pinned: "left",
      width: 200,
    },
    ...calendar.flatMap((month) =>
      month.weeks.map((week) => ({
        headerName: `${month.monthLabel} - ${week.weekLabel}`,
        field: `weeks.${week.week}.salesUnits`,
        editable: true,
        width: 120,
      }))
    ),
  ];
};
