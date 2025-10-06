import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Generate from "./pages/Generate";
import Library from "./pages/Library";
import AssetDetail from "./pages/AssetDetail";
import Settings from "./pages/Settings";

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/generate" element={<Generate />} />
      <Route path="/library" element={<Library />} />
      <Route path="/asset/:id" element={<AssetDetail />} />
      <Route path="/settings" element={<Settings />} />
    </Route>
  </Routes>
);

export default App;
