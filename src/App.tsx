import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import { DataProvider } from './context/DataContext';
import Alunos from './pages/Alunos';
import Professores from './pages/Professores';
import { NavBar, NavLink } from './styles/NavStyle';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <GlobalStyle />
        <NavBar>
          <NavLink to="/alunos">Alunos</NavLink>
          <NavLink to="/professores">Professores</NavLink>
        </NavBar>
        <Routes>
          <Route path="/alunos" element={<Alunos />} />
          <Route path="/professores" element={<Professores />} />
          <Route path="*" element={<Alunos />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}
