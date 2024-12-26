import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Main } from "./pages/Main";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/"  element={
          <ProtectedRoute>
            <Main />
          </ProtectedRoute>
        }/>
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
