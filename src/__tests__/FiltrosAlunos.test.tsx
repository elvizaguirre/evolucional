import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FiltrosAlunos from '../components/FiltrosAlunos';
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

const mockClassChange = jest.fn();
const mockDegreeChange = jest.fn();

const renderComponent = () => {
  render(
    <DataContext.Provider
      value={{
        degrees: degreesMock,
        classes: classesMock,
        students: [],
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
        deleteRelationship: jest.fn(),
      }}
    >
      <FiltrosAlunos onClassChange={mockClassChange} onDegreeChange={mockDegreeChange} selectedClassId={undefined} selectedDegreeId={undefined} />
    </DataContext.Provider>
  );
};

describe('FiltroAlunos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve alternar a visibilidade dos filtros', () => {
    renderComponent();

    const btnOcultar = screen.getByRole('button', { name: /ocultar filtros/i });
    fireEvent.click(btnOcultar);
    expect(screen.queryByLabelText(/série/i)).not.toBeInTheDocument();

    const btnMostrar = screen.getByRole('button', { name: /mostrar filtros/i });
    fireEvent.click(btnMostrar);

    expect(screen.getByLabelText(/série/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/classe/i)).toBeInTheDocument();


  });

  it('deve permitir selecionar filtros e chamar a função de busca', async () => {
    renderComponent();

    // Selecionar Série
    const dropdownSerie = screen.getByTestId('degree-dropdown');
    fireEvent.click(dropdownSerie);
    const optionSerie = screen.getAllByText('1ª Série')[0];
    fireEvent.click(optionSerie);

    expect(mockDegreeChange).toHaveBeenCalledWith(1);

    // Selecionar Classe
    const dropdownClasse = screen.getByTestId('class-dropdown');
    fireEvent.click(dropdownClasse);
    const optionClasse = screen.getAllByText('Classe A')[0];
    fireEvent.click(optionClasse);
    expect(mockClassChange).toHaveBeenCalledWith(1);
  });

  it('deve limpar filtros ao clicar em Limpar', () => {
    renderComponent();
    const limparBtn = screen.getByRole('button', { name: /limpar/i });
    fireEvent.click(limparBtn);
    expect(mockDegreeChange).toHaveBeenCalledWith(undefined);
    expect(mockClassChange).toHaveBeenCalledWith(undefined);
  });
});