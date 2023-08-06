import { useCallback, useEffect, useMemo } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../../services/api';
import { useNavigate, useParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Delete() {
  // Acessos e token
  const token = localStorage.getItem("access_token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const { id } = useParams();
  const navigate = useNavigate();

  // Utilizando a api para deletar
  const deleteData = useCallback(async () => {
    try {
      const response = await api.delete(`api/employee/${id}`, {
        headers,
      });

      console.log(response);
      return navigate('/dashboard/employee');

    } catch (err) {
      console.log(err);
    }
  }, [id, headers, navigate]);

  // Utilizando Hook para executar determinada função, se necessario limpar ou cancelar. 
  useEffect(() => {
    deleteData();

  }, [id, headers, deleteData]);

}
