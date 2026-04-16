import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import BoardDetailPage from "./pages/BoardDetailPage"
import BoardPage from "./pages/BoardPage"
import BoardLayout from "./components/BoardLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="caisse" element={<HomePage />} />
        <Route path="divers" element={<HomePage />} />
        <Route path="source" element={<HomePage />} />
        
        <Route path="board" element={<BoardPage />}/>
        <Route path="board/:boardId/" element={<BoardLayout />}>
          <Route index element={<BoardDetailPage />}/>
          <Route path=":planningId" element={<BoardDetailPage />}/>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
