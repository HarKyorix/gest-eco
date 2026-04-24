import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Layout from "./components/Layout"
import { AlertDialogDestructive } from "@/components/AlertDialogDestructive"
import { DialogForm } from "@/components/DialogForm"
import { useAppStore } from "./store/app.store"
import { ToastContainer } from "@/components/Toast"
import { useSettingStore } from "./store/setting.store"
import { useEffect } from "react"
import BoardPage from "./pages/BoardPage"
import CaissePage from "./pages/CaissePage"
import DiversPage from "./pages/DiversPage"
import SourcePage from "./pages/SourcePage"

function App() {
  const appStore = useAppStore()
  const settingStore = useSettingStore()

  // Apply dark mode class to document
  useEffect(() => {
    const root = document.documentElement
    const isDark = settingStore.theme === 'dark' || 
                   (settingStore.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settingStore.theme])
  
  return (
    <>
      <BrowserRouter>
        <Routes>          
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />}/>
            <Route path="caisse" element={<CaissePage />} />
            <Route path="divers" element={<DiversPage />} />
            <Route path="source" element={<SourcePage />} />
            <Route path="board" element={<BoardPage />}/>
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
