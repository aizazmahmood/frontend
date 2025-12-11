import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { EventsPage } from "./features/events/EventsPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route path="*" element={<Navigate to="/events" replace />} />
    </Routes>
  );
}

export default App;
