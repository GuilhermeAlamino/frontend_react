import React, { useEffect, useCallback, useMemo, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import api from '../../services/api';

function CollapsibleListItem({ title, icon, items }) {
  const [collapseOpen, setCollapseOpen] = useState(false);

  function toggleCollapse() {
    setCollapseOpen(!collapseOpen);
  }

  return (
    <li>
      <Link onClick={toggleCollapse} className="nav-link px-0 align-middle text-white">
        <i className={`fs-4 bi ${icon}`}></i>{" "}
        <span className="ms-1 d-none d-sm-inline">{title}</span>{" "}
        <i className={`fs-4 bi ${collapseOpen ? 'bi-arrow-down-short' : 'bi-arrow-left-short'}`}></i>
      </Link>
      {collapseOpen && (
        <div className={`collapse${collapseOpen ? ' show' : ''}`}>
          <ul className="nav flex-column">
            {items.map((item, index) => (
              <li key={index}>
                <Link to={item.to} className="nav-link px-0 align-middle text-white">
                  <i className={`fs-4 bi ${item.icon}`}></i> <span className="ms-1 d-none d-sm-inline">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function Dashboard() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const navigate = useNavigate();

  // Utilizando a api pegar o usuario logado
  const loginDashboard = useCallback(async () => {

    try {
      const response = await api.post('api/user', {}, { headers });
      console.log(response);
    } catch (err) {
      if (err.response && err.response.data) {
        const message = err.response.data.message;
        if (message === 'Token Invalid.' || message === 'Token expired.' || message === 'Token Not Found.') {
          return navigate('/login');
        }
      }
    }
  }, [navigate, headers]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    loginDashboard();
  }, [loginDashboard]);

  // Utilizando a api fazer logout e redirecionar
  async function logoutDashboard(e) {
    e.preventDefault();

    try {
      const response = await api.post('api/logout', {}, { headers });

      console.log(response);
      localStorage.removeItem('access_token');
      return navigate('/login');

    } catch (err) {
      console.error(err);
    }
  }

  // Listagem de menus
  const menuItems = [
    {
      title: "Funcionarios",
      icon: "bi-people",
      items: [
        {
          to: "/dashboard/employee/store",
          icon: "bi-plus",
          label: "Adicionar Funcionário",
        },
        {
          to: "/dashboard/employee",
          icon: "bi-list-task",
          label: "Gerenciar Funcionário",
        },
      ],
    },
    {
      title: "Departamentos",
      icon: "bi-building",
      items: [
        {
          to: "/dashboard/department/store",
          icon: "bi-plus",
          label: "Adicionar Departamento",
        },
        {
          to: "/dashboard/department",
          icon: "bi-list-task",
          label: "Gerenciar Departamentos",
        },
      ],
    },
    {
      title: "Tarefas",
      icon: "bi-card-list",
      items: [
        {
          to: "/dashboard/task/store",
          icon: "bi-plus",
          label: "Adicionar Tarefa",
        },
        {
          to: "/dashboard/task",
          icon: "bi-list-task",
          label: "Gerenciar Tarefas",
        },
      ],
    },
  ];

  return (

    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <a href="/" className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none">
              <span className="fs-5 fw-bolder d-none d-sm-inline">Admin Dashboard</span>
            </a>
            <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
              <Link to="/dashboard/home" className="nav-link text-white px-0 align-middle">
                <i className="fs-4 bi-house"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
              </Link>
              {menuItems.map((item, index) => (
                <CollapsibleListItem key={index} title={item.title} icon={item.icon} items={item.items} />
              ))}
              <Link onClick={logoutDashboard} className="nav-link text-white px-0 align-middle">
                <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Logout</span>
              </Link>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className='p-2 d-flex justify-content-center shadow'>
            <h4>Sistema de Gestão</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
