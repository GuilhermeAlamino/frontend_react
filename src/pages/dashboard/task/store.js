import React, { useState, useCallback, useEffect, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function Store() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Gerenciando estados
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee_id, setAssigneeId] = useState('');
  const [due_date, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);

  // Mensagens de erro ou sucesso
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [assigneeIdError, setAssigneeIdError] = useState('');
  const [dueDateError, setDueDateError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  // Utilizando a api para pegar funcionarios
  const loadTask = useCallback(async () => {
    try {
      const response = await api.get('api/employee', {
        headers,
      });
      setTasks(response.data.response);

    } catch (err) {
      console.log(err);
    }
  }, [headers]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    loadTask();
  }, [loadTask]);

  // Utilizando a api para criar tarefa
  const taskStore = useCallback(async (e) => {
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
        due_date
      };

      const response = await api.post('api/task', data, { headers });
      setMessageSuccess(response.data.message);

      setTimeout(() => {
        setMessageSuccess('');
      }, 2000);
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data) {

        const { title, description, assignee_id } = err.response.data.message;

        if (title === undefined) {
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

      } else {
        console.log(err);
        setMessageError('Um erro ocorreu. Por favor, tente novamente mais tarde.');
      }
    }
  }, [headers, title, description, assignee_id, due_date]);

  function handleTaskChange(e) {
    setAssigneeId(e.target.value);
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
      </div>

      <div className="content">
        <div className="row mx-2 pt-4">

          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Criar Tarefa</div>
              <div className="card-body">

                <form onSubmit={taskStore}>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Titulo</label>
                    <input type="text" className="form-control" id="title" name="title" value={title}
                      onChange={(e) => setTitle(e.target.value)} placeholder='Digite titulo' autoComplete='off'
                    />
                    {titleError && <div className="text-danger">{titleError}</div>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Descrição</label>
                    <input type="text" className="form-control" id="description" name="description" value={description}
                      onChange={(e) => setDescription(e.target.value)} placeholder='Digite descrição' autoComplete='off'
                    />
                    {descriptionError && <div className="text-danger">{descriptionError}</div>}

                  </div>
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">Funcionario</label>
                    <select className="form-control" name="assignee_id" defaultValue={assignee_id} onChange={handleTaskChange} id="assignee_id" aria-label="Default select example">
                      <option value="" disabled>Escolha um funcionario</option>
                      {tasks.map((task) => (
                        <option key={task.id} value={task.id}>
                          {task.email}
                        </option>
                      ))}
                    </select>
                    {assigneeIdError && <div className="text-danger">{assigneeIdError}</div>}
                  </div>
                  <div className="col-12">
                    <label htmlFor="due_date">Prazo</label>
                    <input type="datetime-local" className="form-control" id="due_date" name="due_date" onChange={(e) => setDueDate(e.target.value)} />
                    {dueDateError && <div className="text-danger">{dueDateError}</div>}
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
