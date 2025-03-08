import React, { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Charts from "./components/Charts";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import NotFound from "./components/NotFound";
import { RootState } from "./store";

const Login = lazy(() => import("./components/Login"));
const Store = lazy(() => import("./components/Store"));
const Sku = lazy(() => import("./components/Sku"));
const Planning = lazy(() => import("./components/Planning"));

// PrivateRoute component to protect routes

type PrivateProps = {
  element: React.ReactElement<any>;
};
const PrivateRoute = ({ element }: PrivateProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && !isAuthenticated) {
      dispatch({ type: "LOGIN_SUCCESS", payload: storedToken });
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<Store />} />
          <Route path="store" element={<Store />} />
          <Route path="sku" element={<Sku />} />
          <Route path="planning" element={<Planning />} />
          <Route path="charts" element={<Charts />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
