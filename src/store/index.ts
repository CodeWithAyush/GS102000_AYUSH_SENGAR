import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import planningData from "../lib/data/planningData.json";
import skusData from "../lib/data/skus.json";
import storesData from "../lib/data/stores.json";
import weeksData from "../lib/data/weeks.json";
import { AppState, Month, SKU, Store, Week } from "../types";

const generateCalendar = (weeks: Week[]): Month[] => {
  const months = Array.from(new Set(weeks.map((w) => w.month))).map((month) => ({
    month,
    monthLabel: weeks.find((w) => w.month === month)?.monthLabel || "",
    weeks: weeks.filter((w) => w.month === month),
  }));
  return months;
};

const initialState: AppState = {
  stores: storesData,
  skus: skusData,
  weeks: weeksData,
  planningData: planningData || [],
  calendar: generateCalendar(weeksData),
  selectedStore: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addStore(state, action: PayloadAction<Store>) {
      state.stores.push(action.payload);
    },
    editStore(state, action: PayloadAction<Store>) {
      const index = state.stores.findIndex((store) => store.id === action.payload.id);
      if (index !== -1) state.stores[index] = action.payload;
    },
    deleteStore: (state, action: { payload: string }) => {
        const storeId = action.payload;
        state.stores = state.stores.filter((store) => store.id !== storeId);
        state.planningData = state.planningData.filter((pd) => pd.storeId !== storeId);
      },
    reorderStores(state, action: PayloadAction<Store[]>) {
      state.stores = action.payload.map((store, index) => ({ ...store, seqNo: index + 1 }));
    },
    addSKU(state, action: PayloadAction<SKU>) {
      state.skus.push(action.payload);
    },
    deleteSku: (state, action: { payload: string }) => {
        const skuId = action.payload;
        state.skus = state.skus.filter((sku) => sku.id !== skuId);
        state.planningData = state.planningData.filter((pd) => pd.skuId !== skuId);
      },
    editSKU(state, action: PayloadAction<SKU>) {
      const index = state.skus.findIndex((sku) => sku.id === action.payload.id);
      if (index !== -1) state.skus[index] = action.payload;
    },
    reorderSKUs(state, action: PayloadAction<SKU[]>) {
      state.skus = action.payload;
    },
    addWeek(state, action: PayloadAction<Week>) {
      state.weeks.push(action.payload);
      state.calendar = generateCalendar(state.weeks);
    },
    editWeek(state, action: PayloadAction<Week>) {
      const index = state.weeks.findIndex((week) => week.week === action.payload.week);
      if (index !== -1) {
        state.weeks[index] = action.payload;
        state.calendar = generateCalendar(state.weeks);
      }
    },
    reorderWeeks(state, action: PayloadAction<Week[]>) {
      state.weeks = action.payload.map((week, index) => ({ ...week, seqNo: index + 1 }));
      state.calendar = generateCalendar(state.weeks);
    },
    updatePlanningData(
      state,
      action: PayloadAction<{ storeId: string; skuId: string; weekId: string; salesUnits: number }>
    ) {
      const { storeId, skuId, weekId, salesUnits } = action.payload;
      const planningIndex = state.planningData.findIndex(
        (pd) => pd.storeId === storeId && pd.skuId === skuId && pd.weekId === weekId
      );
      if (planningIndex !== -1) {
        state.planningData[planningIndex].salesUnits = salesUnits;
      } else {
        state.planningData.push({ storeId, skuId, weekId, salesUnits });
      }
    },
    setSelectedStore: (state, action: PayloadAction<string>) => {
      state.selectedStore = action.payload;
    },
  },
});

export const {
  addStore,
  editStore,
  reorderStores,
  deleteStore,
  deleteSku,
  addSKU,
  editSKU,
  reorderSKUs,
  addWeek,
  editWeek,
  reorderWeeks,
  updatePlanningData,
  setSelectedStore
} = appSlice.actions;

const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false, username: null as string | null },
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.username = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;