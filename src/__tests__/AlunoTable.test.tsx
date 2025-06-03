import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlunoTable from '../components/AlunoTable';
import { DataContext } from '../context/DataContext';

const studentsMock = [
  {
    id: 1,
    name: 'João Silva',
    ra: 12345,
    degreeId: 1,
    classId: 2,
  },
  {
    id: 2,
    name: 'Maria Souza',
    ra: 54321,
    degreeId: 2,
    classId: 1,
  }
];

const degreesMock = [
  { id: 1, name: '1ª Série' },
  { id: 2, name: '2ª Série' }
];

const classesMock = [
  { name: 'Classe A' },
  { name: 'Classe B' }
];

describe('AlunoTable', () => {
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const renderComponent = (students = studentsMock) => {
    render(
      <DataContext.Provider
        value={{
          students,
          degrees: degreesMock,
          classes: classesMock,
          teachers: [],
          matters: [],
          relationships: [],
          updateStudent: jest.fn(),
          deleteStudent: jest.fn(),
          getFilteredStudents: jest.fn(),
          generateStudents: jest.fn(),
          addRelationship: jest.fn(),
          updateRelationship: jest.fn(),
          getRelationshipById: jest.fn(),
          deleteRelationship: jest.fn()
        }}
      >
        <AlunoTable alunos={students} onDelete={mockDelete} onEdit={mockUpdate} />
      </DataContext.Provider>
    );
  };

  it('deve exibir os nomes, séries e classes dos alunos', () => {
    renderComponent();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Souza')).toBeInTheDocument();
    expect(screen.getByText('1ª Série')).toBeInTheDocument();
    expect(screen.getByText('2ª Série')).toBeInTheDocument();
    expect(screen.getByText('Classe A')).toBeInTheDocument();
    expect(screen.getByText('Classe B')).toBeInTheDocument();
  });

  it('deve renderizar botões de editar e excluir para cada aluno', () => {
    renderComponent();
    const buttons = screen.getAllByRole('button');
    const editButtons = buttons.filter(btn => btn.getAttribute('name') === 'Editar Aluno');
    const deleteButtons = buttons.filter(btn => btn.getAttribute('name') === 'Excluir Aluno');
    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);
  });

  it('deve permitir paginação corretamente', () => {
    const alunosPaginated = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      ra: 100 + i,
      name: `Aluno ${i + 1}`,
      degreeId: 1,
      classId: 1,
    }));

    renderComponent(alunosPaginated);

    expect(screen.getByText('Aluno 1')).toBeInTheDocument();
    expect(screen.getByText('Aluno 10')).toBeInTheDocument();
    expect(screen.queryByText('Aluno 11')).not.toBeInTheDocument();

    const nextPage = screen.getByLabelText('Next Page');
    fireEvent.click(nextPage);

    expect(screen.getByText('Aluno 11')).toBeInTheDocument();
  });

  it('deve abrir o modal de edição ao clicar em Editar', () => {
    renderComponent();
    const editButtons = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'Editar Aluno');
    
    fireEvent.click(editButtons[0]);

    expect(mockUpdate).toHaveBeenCalledWith(studentsMock[0]);
  });

  it('deve abrir o modal de confirmação e excluir o aluno', () => {
    renderComponent();
    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'Excluir Aluno');
    
    fireEvent.click(deleteButtons[1]);

    expect(mockDelete).toHaveBeenCalledWith(studentsMock[1]);
  });
});
