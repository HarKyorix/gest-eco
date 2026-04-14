import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import DetailPage from "./pages/DetailPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage />
          }
        />

        <Route
          path="/detail/:tableId"
          element={<DetailPage />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
