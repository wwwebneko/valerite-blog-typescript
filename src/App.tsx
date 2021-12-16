import React, { ReactElement } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import './App.scss';

function Dashboard(): ReactElement {
  return (
    <p>Dashboard</p>
  )
}

function List(): ReactElement {
  return (
    <p>List</p>
  )
}

function NoMatch(): ReactElement {
  return (
    <p>404</p>
  )
}

function PublicLayout(): ReactElement {
  return (
    <div>
      <header>This is public header</header>
      <Outlet />
      <footer>This if public footer</footer>
    </div>
  )
}

function DashboardLayout(): ReactElement {
  return (
    <div>
      <header>This is dashboard header</header>
      <Outlet />
      <footer>This if dashboard footer</footer>
    </div>
  )
}

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<List />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;
