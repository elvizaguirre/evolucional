import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Alunos from '../pages/Alunos';
import { DataContext } from '../context/DataContext';

jest.mock("react-apexcharts", () => ({
  __esModule: true,
  default: () => <div />,
}));

const studentsMock = [
  { id: 1, ra: 101, name: 'João Silva', degreeId: 1, classId: 1 },
];

const degreesMock = [
  { id: 1, name: '1ª Série' },
];

const classesMock = [
  { name: 'Classe A' },
];

describe('Alunos', () => {
  const mockUpdateStudent = jest.fn();
  const mockDeleteStudent = jest.fn();
  const mockGenerateStudents = jest.fn();
  const getFilteredStudents = (degreeId?: number, classId?: number) => {
    return studentsMock.filter((s) => {
      const matchDegree = degreeId === undefined || s.degreeId === degreeId;
      const matchClass = classId === undefined || s.classId === classId;
      return matchDegree && matchClass;
    });
  };

  const renderComponent = () => {
    render(
      <DataContext.Provider
        value={{
          students: studentsMock,
          degrees: degreesMock,
          classes: classesMock,
          updateStudent: mockUpdateStudent,
          deleteStudent: mockDeleteStudent,
          generateStudents: mockGenerateStudents,
          getFilteredStudents: getFilteredStudents,
          addRelationship: jest.fn(),
          updateRelationship: jest.fn(),
          getRelationshipById: jest.fn(),
          deleteRelationship: jest.fn(),
          matters: [],
          teachers: [],
          relationships: [],
        }}
      >
        <Alunos />
      </DataContext.Provider>
    );
  };

  beforeEach(() => jest.clearAllMocks());

  it('deve renderizar a página com tabela de alunos', () => {
    renderComponent();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  it('deve chamar generateStudents ao clicar em Gerar Alunos', () => {
    renderComponent();
    const gerarBtn = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'gerar alunos')[0];
    fireEvent.click(gerarBtn);
    expect(mockGenerateStudents).toHaveBeenCalled();
  });

  it('deve exibir modal de edição ao clicar no botão de editar', () => {
    renderComponent();
    const editButtons = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'Editar Aluno');
    fireEvent.click(editButtons[0]);
    expect(screen.getByText('Editar Aluno')).toBeInTheDocument();
  });

  it('deve exibir modal de confirmação ao clicar no botão de excluir', () => {
    renderComponent();
    const deleteButtons = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'Excluir Aluno');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByText('Tem certeza que deseja excluir este aluno?')).toBeInTheDocument();
  });
});
