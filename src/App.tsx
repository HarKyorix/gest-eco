import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import BoardDetailPage from "./pages/BoardDetailPage"
import BoardPage from "./pages/BoardPage"
import BoardLayout from "./components/BoardLayout"
import { AlertDialogDestructive } from "@/components/AlertDialogDestructive"
import { DialogForm } from "@/components/DialogForm"
import { useAppStore } from "./store/app.store"
import { ToastContainer } from "@/components/Toast"

function App() {
  const appStore = useAppStore()
  
  return (
    <>
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

      <DialogForm
        open={appStore.form.open}
        title={appStore.form.title}
        description={appStore.form.description}
        fields={appStore.form.fields}
        initialData={appStore.form.initialData}
        close={() => appStore.closeForm()}
        submit={(data) => appStore.submitForm(data)}
      />

      <AlertDialogDestructive
        open={appStore.alert.open}
        title={appStore.alert.title}
        description={appStore.alert.description}
        close={() => appStore.closeDialog()}
        confirm={() => appStore.confirmDialog()}
      />

      <ToastContainer />
    </>
  )
}

export default App
