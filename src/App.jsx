import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetails from "./pages/DestinationDetails";
import Itinerary from "./pages/Itinerary";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-indigo-600 to-purple-600 text-white">
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destination/:slug" element={<DestinationDetails />} />
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
