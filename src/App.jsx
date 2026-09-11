import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import ChallengeLevels from "./pages/ChallengeLevels";
import Challenge from "./pages/Challenge";
import EasyLevels from "./pages/EasyLevels";
import ProtectedRoute from "./components/ProtectedRoute";
import MediumLevels from "./pages/MediumLevels";
import AdvancedLevels from "./pages/AdvancedLevels";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            PUBLIC ROUTES
        ====================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
<Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>
<Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* =====================================================
            PROTECTED ROUTES
        ====================================================== */}

        <Route element={<ProtectedRoute />}>

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Free SQL Practice */}
          <Route
            path="/practice"
            element={<Practice />}
          />

          {/* Challenge Level Selection */}
          <Route
            path="/challenge-levels"
            element={<ChallengeLevels />}
          />

          {/* Easy Level Map */}
          <Route
            path="/challenge-levels/easy"
            element={<EasyLevels />}
          />

          {/* Medium Level Map */}
          <Route
            path="/medium-levels"
            element={<MediumLevels />}
          />
          <Route
  path="/advanced-levels"
  element={<AdvancedLevels />}
/>
<Route
  path="/progress"
  element={<Progress />}
/>
<Route path="/profile" element={<Profile />} />

          {/* =================================================
              EASY CHALLENGE
              EXISTING ROUTE — UNCHANGED
          ================================================== */}

          <Route
            path="/challenge/:level"
            element={<Challenge />}
          />

          {/* =================================================
              MEDIUM CHALLENGE
              NEW ROUTE
          ================================================== */}

         {/* MEDIUM CHALLENGE */}
<Route
  path="/challenge/medium/:mediumLevel"
  element={<Challenge />}
/>
<Route
  path="/challenge/advanced/:advancedLevel"
  element={<Challenge />}
/>

        </Route>


        {/* =====================================================
            FALLBACK
        ====================================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
              <div className="text-center">
                <h1 className="text-4xl font-black">
                  404
                </h1>

                <p className="mt-2 text-zinc-500">
                  Page not found
                </p>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;