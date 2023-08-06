import React, { useState, useCallback, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function Store() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Gerenciando estados
  const [name, setName] = useState('');

  // Mensagens de erro ou sucesso
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  // Utilizando api para criar departamentos 
  const departamentStore = useCallback(async (e) => {
    e.preventDefault();
    setNameError('');
    setMessageError('');

    try {

      const data = {
        name
      };

      const response = await api.post('api/department', data, { headers });
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
  }, [headers, name]);

  return (
    <div className="content-wrapper">
      <div className="content-header">
      </div>

      <div className="content">
        <div className="row mx-2 pt-4">

          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Criar Departamento</div>
              <div className="card-body">

                <form onSubmit={departamentStore}>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="name" name="name" value={name}
                      onChange={(e) => setName(e.target.value)} placeholder='Digite nome' autoComplete='off'
                    />
                    {nameError && <div className="text-danger">{nameError}</div>}
                    {messageError && <div className="text-danger">{messageError}</div>}
                    {messageSuccess && <div className="form-control bg-success text-white mt-2 text-center">{messageSuccess}</div>}
                  </div>
                  <div className="col-12 pt-3">
                    <button type="submit" className="form-control btn btn-primary">Create</button>
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
