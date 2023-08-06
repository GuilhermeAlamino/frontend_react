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
    handleRowClick(`/dashboard/task/delete/${id}`);
  };

  // Gerenciando estados
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee_id, setAssigneeId] = useState('');
  const [assignee_name, setAssigneeName] = useState("");
  const [due_date, setDueDate] = useState('');
  const [employees, setEmployees] = useState([]);

  // Mensagens de erro ou sucesso
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [assigneeIdError, setAssigneeIdError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  // Utilizando a api para pegar alguma tarefa especifica
  const loadTasks = useCallback(async () => {
    try {
      const response = await api.get(`api/task/${id}`, {
        headers,
      });

      const taskData = response.data.response[0];


      setTitle(taskData.title);
      setDescription(taskData.description);
      setAssigneeId(taskData.employee.id);
      setAssigneeName(taskData.employee.email);
      setDueDate(taskData.due_date);

    } catch (err) {
      console.log(err);
    }
  }, [id, headers]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    loadTasks();

    const fetchTasks = async () => {
      try {
        const response = await api.get("api/employee", {
          headers,
        });

        setEmployees(response.data.response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTasks();
  }, [id, headers, loadTasks]);

  // Utilizando a api para atualizar alguma tarefa
  const taskUpdate = useCallback(async (e) => {
    e.preventDefault();
    setTitleError('');
    setDescriptionError('');
    setAssigneeIdError('');
    setDueDateError('');

    try {

      const data = {
        title,
        description,
        assignee_id,
        due_date,
      };

      const response = await api.put('api/task/' + id, data, { headers });
      setMessageSuccess(response.data.message);

      setTimeout(() => {
        setMessageSuccess('');
      }, 2000);

    } catch (err) {
      console.log(err);

      if (err.response && err.response.data) {

        const { title, description, assignee_id, due_date } = err.response.data.message;

        if (title === undefined && description === undefined && assignee_id === undefined && due_date === undefined) {
          setMessageError(err.response.data.message);
        }

        if (title) {
          setTitleError(title[0]);
        }
        if (description) {
          setDescriptionError(description[0]);
        }
        if (assignee_id) {
          setAssigneeIdError(assignee_id[0]);
        }
        if (due_date) {
          setDueDateError(due_date[0]);
        }


      } else {
        console.log(err);
        setMessageError('Um erro ocorreu. Por favor, tente novamente mais tarde.');
      }
    }
  }, [headers, id, title, description, assignee_id, due_date]);

  const handleTaskChange = (e) => {
    setAssigneeId(e.target.value);
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
                <div className="col-6">Tarefa</div>
                <div className="col-6 d-flex justify-content-end">
                  <Link onClick={handleDeleteClick} className="btn btn-danger btn-sm btn-act-table">  <i className="fas fa-trash"></i> Deletar</Link>
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={taskUpdate}>
                  <div className="col-12">
                    <label htmlFor="title" className="form-label">Titulo</label>
                    <input type="text" className="form-control" id="title" name="title" defaultValue={title}
                      onChange={(e) => setTitle(e.target.value)} placeholder='Digite titulo' autoComplete='off'
                    />
                    {titleError && <div className="text-danger">{titleError}</div>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="description" className="form-label">Descrição</label>
                    <input type="text" className="form-control" id="description" name="description" defaultValue={description}
                      onChange={(e) => setDescription(e.target.value)} placeholder='Digite descrição' autoComplete='off'
                    />
                    {descriptionError && <div className="text-danger">{descriptionError}</div>}

                  </div>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Funcionario</label>
                    <select className="form-control" name="assignee_id" onChange={handleTaskChange} id="assignee_id" aria-label="Default select example">
                      {(assignee_id === null || assignee_id === '') ? (
                        <option value="">Escolha um funcionario</option>
                      ) : (
                        <option defaultValue={assignee_id}>{assignee_name}</option>
                      )}
                      {employees && employees.length > 0 && employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.email}
                        </option>
                      ))}
                    </select>
                    {assigneeIdError && <div className="text-danger">{assigneeIdError}</div>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="due_date">Prazo</label>
                    <input type="datetime-local" className="form-control" id="due_date" defaultValue={due_date} name="due_date" onChange={(e) => setDueDate(e.target.value)} />
                    {dueDateError && <div className="text-danger">{dueDateError}</div>}
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
      </div >
    </div >
  )
}
