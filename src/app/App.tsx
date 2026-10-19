import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/main"
import AboutPage from "../pages/test"

export default function App() {
  return (
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/abosut" element={<AboutPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}