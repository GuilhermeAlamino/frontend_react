import React from 'react'

export default function DashboardHome() {
  return (
    <div>
      <div className='row m-3 mt-3'>
        <div className='col px-3 py-3 mx-3 mt-2 mb-3 border shadow-sm'>
          <div className='text-center pb-1'>
            <h4>Funcionario</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: </h5>
          </div>
        </div>
        <div className='col px-3 py-3 mx-3 mt-2 mb-3 border shadow-sm'>
          <div className='text-center pb-1'>
            <h4>Departamento</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total:</h5>
          </div>
        </div>
        <div className='col px-3 py-3 mx-3 mt-2 mb-3 border shadow-sm'>
          <div className='text-center pb-1'>
            <h4>Tarefas</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total:</h5>
          </div>
        </div>
      </div>

    </div>
  )
}

