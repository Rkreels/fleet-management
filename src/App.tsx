import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import VehiclesPage from './pages/Vehicles'
import DriversPage from './pages/Drivers'
import GPSPage from './pages/GPS'
import FuelPage from './pages/Fuel'
import FASTagPage from './pages/FASTag'
import MaintenancePage from './pages/Maintenance'
import TyresPage from './pages/Tyres'
import TripsPage from './pages/Trips'
import InventoryPage from './pages/Inventory'
import ReportsPage from './pages/Reports'
import AlertsPage from './pages/Alerts'
import SAPExportPage from './pages/SAPExport'
import SettingsPage from './pages/Settings'

function App() {
  return (
    <BrowserRouter basename="/fleet-management">
      <Routes>
        <Route path="/" element={<Navigate to="/fleet-management" replace />} />
        <Route path="/fleet-management" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="gps" element={<GPSPage />} />
          <Route path="fuel" element={<FuelPage />} />
          <Route path="fastag" element={<FASTagPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="tyres" element={<TyresPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="sap-export" element={<SAPExportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
