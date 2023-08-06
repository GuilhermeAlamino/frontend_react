import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import DashboardHome from './pages/dashboard/content/home.js';
import Employee from './pages/dashboard/employee';
import EmployeeStore from './pages/dashboard/employee/store';
import EmployeeShow from './pages/dashboard/employee/show';
import EmployeeDelete from './pages/dashboard/employee/delete';
import Department from './pages/dashboard/department';
import DepartmentStore from './pages/dashboard/department/store';
import DepartmentShow from './pages/dashboard/department/show';
import DepartmentDelete from './pages/dashboard/department/delete';
import Task from './pages/dashboard/task';
import TaskStore from './pages/dashboard/task/store';
import TaskShow from './pages/dashboard/task/show';
import TaskDelete from './pages/dashboard/task/delete';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <p>Página não encontrada</p>
      <Link className='notfound' to="/">Voltar à página inicial</Link>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="/dashboard/home" element={<DashboardHome />}></Route>
          <Route path="/dashboard/employee" element={<Employee />}></Route>
          <Route path="/dashboard/employee/store" element={<EmployeeStore />}></Route>
          <Route path="/dashboard/employee/show/:id" element={<EmployeeShow />}></Route>
          <Route path="/dashboard/employee/delete/:id" element={<EmployeeDelete />}></Route>
          <Route path="/dashboard/department" element={<Department />}></Route>
          <Route path="/dashboard/department/store" element={<DepartmentStore />}></Route>
          <Route path="/dashboard/department/show/:id" element={<DepartmentShow />}></Route>
          <Route path="/dashboard/department/delete/:id" element={<DepartmentDelete />}></Route>
          <Route path="/dashboard/task" element={<Task />}></Route>
          <Route path="/dashboard/task/store" element={<TaskStore />}></Route>
          <Route path="/dashboard/task/show/:id" element={<TaskShow />}></Route>
          <Route path="/dashboard/task/delete/:id" element={<TaskDelete />}></Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
