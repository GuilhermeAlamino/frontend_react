import React, { useState, useCallback, useEffect, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';

export default function Store() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Gerenciando estados
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department_id, setDepartmentId] = useState('');
  const [departments, setDepartments] = useState([]);

  // Mensagens de erro ou sucesso
  const [firstNameError, setfirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [departmentIdError, setDepartmentIdError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [messageSuccess, setMessageSuccess] = useState('');

  // Utilizando a api pegar departamentos
  const loadDepartment = useCallback(async () => {
    try {
      const response = await api.get('api/department', {
        headers,
      });
      setDepartments(response.data.response);

    } catch (err) {
      console.log(err);
    }
  }, [headers]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    loadDepartment();
  }, [loadDepartment]);

  // Utilizando a api para criar um funcionario
  const employeeStore = useCallback(async (e) => {
    e.preventDefault();
    setfirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setDepartmentIdError('');
    setMessageError('');

    try {

      const data = {
        firstName,
        lastName,
        email,
        phone,
        department_id,
      };

      const response = await api.post('api/employee', data, { headers });
      setMessageSuccess(response.data.message);

      setTimeout(() => {
        setMessageSuccess('');
      }, 2000);
    } catch (err) {
      console.log(err);

      if (err.response && err.response.data) {

        const { firstName, lastName, email, phone, department_id } = err.response.data.message;

        if (firstName === undefined && lastName === undefined && email === undefined && phone === undefined && department_id === undefined) {
          setMessageError(err.response.data.message);
        }

        if (firstName) {
          setfirstNameError(firstName[0]);
        }
        if (lastName) {
          setLastNameError(lastName[0]);
        }
        if (email) {
          setEmailError(email[0]);
        }
        if (phone) {
          setPhoneError(phone[0]);
        }
        if (department_id) {
          setDepartmentIdError(department_id[0]);
        }

      } else {
        console.log(err);
        setMessageError('Um erro ocorreu. Por favor, tente novamente mais tarde.');
      }
    }
  }, [headers, firstName, lastName, email, phone, department_id]);

  function handleDepartmentChange(e) {
    setDepartmentId(e.target.value);
  }

  return (
    <div className="content-wrapper">
      <div className="content-header">
      </div>

      <div className="content">
        <div className="row mx-2 pt-4">

          <div className="col-md-12">
            <div className="card">
              <div className="card-header">Criar Funcionario</div>
              <div className="card-body">

                <form onSubmit={employeeStore}>
                  <div className="col-12">
                    <label htmlFor="firstName" className="form-label">Nome</label>
                    <input type="text" className="form-control" id="firstName" name="firstName" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)} placeholder='Digite nome' autoComplete='off'
                    />
                    {firstNameError && <div className="text-danger">{firstNameError}</div>}

                  </div>
                  <div className="col-12">
                    <label htmlFor="lastName" className="form-label">Sobrenome</label>
                    <input type="text" className="form-control" id="lastName" name="lastName" value={lastName}
                      onChange={(e) => setLastName(e.target.value)} placeholder='Digite sobrenome' autoComplete='off'
                    />
                    {lastNameError && <div className="text-danger">{lastNameError}</div>}

                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={email}
                      onChange={(e) => setEmail(e.target.value)} placeholder='Digite email'
                    />
                    {emailError && <div className="text-danger">{emailError}</div>}

                  </div>
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input type="phone" className="form-control" id="phone" name="phone" value={phone}
                      onChange={(e) => setPhone(e.target.value)} placeholder="Digite telefone" autoComplete='off'
                    />
                    {phoneError && <div className="text-danger">{phoneError}</div>}

                  </div>
                  <div className="col-12">
                    <label htmlFor="department_id" className="form-label">Departamento</label>
                    <select className="form-control" name="department_id" defaultValue={department_id} onChange={handleDepartmentChange} id="department_id" aria-label="Default select example">
                      <option value="" disabled>Escolha um departamento</option>
                      {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                    {departmentIdError && <div className="text-danger">{departmentIdError}</div>}
                    {messageError && <div className="text-danger">{messageError}</div>}
                    {messageSuccess && <div className="form-control bg-success text-white mt-2 text-center">{messageSuccess}</div>}

                  </div>
                  <div className="col-12 pt-3">
                    <button type="submit" className="form-control btn btn-primary">Criar</button>
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
