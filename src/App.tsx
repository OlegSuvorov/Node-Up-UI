import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Main } from "./pages/Main";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/"  element={
        <ProtectedRoute>
          <Main />
        </ProtectedRoute>
      }/>
      <Route path="/login" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  );
}

export default App;
