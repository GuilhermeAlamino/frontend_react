import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Link } from 'react-router-dom'
import api from '../../../services/api';
import Pagination from "react-js-pagination";

const ClickableTableRow = ({ department }) => {

  const handleRowClick = (link) => {
    window.location.href = link;
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    handleRowClick(`/dashboard/department/show/${department.id}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleRowClick(`/dashboard/department/delete/${department.id}`);
  };

  return (
    <tr key={department.id} className="clickable-row" onClick={() => handleRowClick(`/dashboard/department/show/${department.id}`)}>
      <td>{department.id}</td>
      <td>{department.name}</td>
      <td className='text-center'>
        <Link onClick={handleViewClick} className="btn btn-primary btn-sm btn-act-table">
          <i className="fas fa-eye"></i> Visualizar
        </Link>
        <Link onClick={handleViewClick} className="btn btn-success btn-sm btn-act-table mx-1">
          <i className="fas fa-edit"></i> Editar
        </Link>
        <Link onClick={handleDeleteClick} className="btn btn-danger btn-sm btn-act-table">
          <i className="fas fa-trash"></i> Deletar
        </Link>
      </td>
    </tr>
  );
};

export default function Employee() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const itemsPerPage = 10; // Defina a quantidade de itens por página
  const minSearchLength = 3; // Número mínimo de caracteres para acionar a pesquisa

  // Gerenciando estados
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [currentSort, setCurrentSort] = useState({ field: "", direction: "asc" });

  // Utilizando api e tratando os params para filtro
  const loadDepartment = useCallback(async (page, searchTerm, perPage, sort, direction) => {
    try {
      let url = `api/department?page=${page}`;

      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }

      if (perPage !== null && perPage !== undefined) {
        url += `&per_page=${perPage}`;
      }

      if (sort) {
        url += `&sort=${sort}`;
        if (direction) {
          url += `&direction=${direction}`;
        }
      }

      const response = await api.get(url, {
        headers,
      });

      setDepartments(response.data.response.data);
      setTotalItemsCount(response.data.response.total);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }, [headers]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    loadDepartment(currentPage, searchTerm, itemsPerPage, currentSort.field, currentSort.direction);
  }, [loadDepartment, currentPage, searchTerm, itemsPerPage, currentSort.field, currentSort.direction]);

  // Utilizando recurso para setar a pesquisa na API 
  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.length >= minSearchLength) {
      setCurrentPage(1);
      loadDepartment(1, newSearchTerm);
    } else {
      setDepartments([]); // Limpar resultados da pesquisa quando o termo for muito curto
    }
  };

  // Utilizando recurso para setar a paginação na API 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    loadDepartment(pageNumber, searchTerm, itemsPerPage, currentSort.field, currentSort.direction);
  };

  // Utilizando recurso para ordenar
  const handleSortChange = (sortField) => {
    let newSortDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';

    setCurrentSort({ field: sortField, direction: newSortDirection });
    setCurrentPage(1);

    // Envia o campo de ordenação para a API
    loadDepartment(1, searchTerm, itemsPerPage, sortField, newSortDirection);
  };

  return (
    <div className="content-wrapper">
      <div className="content-header">
      </div>

      <div className="content">
        <div className="row mx-2 pt-4">

          <div className="col-md-12">
            <div className="card">
              <div className="card-header d-flex align-items-center">
                <div className="col-6">Gerenciar Departamentos</div>
                <div className="col-6 d-flex justify-content-end">
                  <div className="style-button-sort">
                    <button
                      className={`sort-button ${currentSort.field === 'id' ? currentSort.direction : ''}`}
                      onClick={() => handleSortChange('id')}
                    >
                      id {currentSort.field === 'id' ? (currentSort.direction === 'asc' ? '▲' : '▼') : '▲'}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Busque..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th className='text-center'>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map((department) => (
                        <ClickableTableRow key={department.id} department={department} />
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={itemsPerPage}
                      totalItemsCount={totalItemsCount}
                      pageRangeDisplayed={5}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div >
  )
}
