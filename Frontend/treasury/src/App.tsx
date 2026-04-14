import { WelcomePage } from "./pages/WelcomePage"
import { LoginPage } from "./pages/LoginPage"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { RegisterPage } from "./pages/RegisterPage"
import { MainPage } from "./pages/MainPage"
import { AdminMainPage } from "./pages/AdminManePage"
import { ExpencesPage } from "./pages/ExpencesPage"
import { IncomesPage } from "./pages/IncomesPage"
import { BudgetsPage } from "./pages/BudgetsPage"
import { CategoriesPage } from "./pages/CategoriesPage"
import { AdminExpencesPage } from "./pages/AdminExpencesPage"
import { AdminIncomesPage } from "./pages/AdminIncomesPage"
import { AdminRightsPage } from "./pages/AdminRightsPage"
import { ReceiptsPage } from "./pages/ReceiptsPage"
import ProtectedRoute from "./security/ProtectedRoute"
import { InfoPage } from "./pages/InfoPage"

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/main"
          element={
            <ProtectedRoute roles={["user"]}>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/main"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminMainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expences"
          element={
            <ProtectedRoute roles={["user"]}>
              <ExpencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incomes"
          element={
            <ProtectedRoute roles={["user"]}>
              <IncomesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute roles={["user"]}>
              <BudgetsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute roles={["user"]}>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/expenses"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminExpencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/incomes"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminIncomesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rights"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminRightsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <ProtectedRoute roles={["user"]}>
              <ReceiptsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/info"
          element={
            <ProtectedRoute roles={["user"]}>
              <InfoPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
