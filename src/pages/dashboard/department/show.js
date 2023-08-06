import React, { useState, useCallback, useEffect, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import { Link, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Show() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const { id } = useParams();

  // Redirecionando para a rota de deletar
  const handleRowClick = (link) => {
    window.location.href = link;
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    handleRowClick(`/dashboard/department/delete/${id}`);
  };

  // Gerenciando estados
  const [name, setName] = useState('');

  // Mensagens de erro ou sucesso
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  // Utilizando a api para pegar um departamento especifico
  const loadDepartment = useCallback(async () => {
    try {
      const response = await api.get(`api/department/${id}`, {
        headers,
      });

      const departmentData = response.data.response;

      setName(departmentData.name);

    } catch (err) {
      console.log(err);
    }
  }, [id, headers]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    loadDepartment();

  }, [id, headers, loadDepartment]);


  // Utilizando a api para atualizar algum departamento
  const departmentUpdate = useCallback(async (e) => {
    e.preventDefault();
    setNameError('');
    setMessageError('');

    try {

      const data = {
        name
      };

      const response = await api.put('api/department/' + id, data, { headers });
      setMessageSuccess(response.data.message);

      setTimeout(() => {
        setMessageSuccess('');
      }, 2000);

    } catch (err) {
      console.log(err);

      if (err.response && err.response.data) {

        const { name } = err.response.data.message;

        if (name === undefined) {
          setMessageError(err.response.data.message);
        }

        if (name) {
          setNameError(name[0]);
        }

      } else {
        console.log(err);
        setMessageError('Um erro ocorreu. Por favor, tente novamente mais tarde.');
      }
    }
  }, [headers, id, name]);


  return (
    <div className="content-wrapper">
      <div className="content-header">
      </div>

      <div className="content">
        <div className="row mx-2 pt-4">

          <div className="col-md-12">
            <div className="card">
              <div className="card-header d-flex align-items-center">
                <div className="col-6">Departamento</div>
                <div className="col-6 d-flex justify-content-end">
                  <Link onClick={handleDeleteClick} className="btn btn-danger btn-sm btn-act-table">  <i className="fas fa-trash"></i> Deletar</Link>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={departmentUpdate}>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" value={name}
                      onChange={(e) => setName(e.target.value)} placeholder='Digite nome' autoComplete='off'
                    />
                    {nameError && <div className="text-danger">{nameError}</div>}
                    {messageError && <div className="text-danger">{messageError}</div>}
                    {messageSuccess && <div className="form-control bg-success text-white mt-2 text-center">{messageSuccess}</div>}
                  </div>
                  <div className="col-12 pt-3">
                    <button type="submit" className="form-control btn btn-primary">Atualizar</button>
                  </div>
                </form>

              </div>
            </div>


          </div>
        </div>
      </div>
    </div >
  )
}
