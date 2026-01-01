import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import DestinationDetails from "./pages/DestinationDetails";
import Itinerary from "./pages/Itinerary";
import SavedTrips from "./pages/SavedTrips";

import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

import NavBar from "./components/NavBar";
import { isAuthenticated } from "./utils/auth";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/signin?redirect=${redirect}`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 text-white">
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destination/:slug" element={<DestinationDetails />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          <Route
            path="/saved"
            element={
              <ProtectedRoute>
                <SavedTrips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/itinerary"
            element={
              <ProtectedRoute>
                <Itinerary />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
