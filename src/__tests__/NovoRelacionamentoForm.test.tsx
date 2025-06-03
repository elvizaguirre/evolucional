import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NovoRelacionamentoForm from '../components/NovoRelacionamentoForm';
import { DataContext } from '../context/DataContext';
import userEvent from '@testing-library/user-event';

const teachersMock = [
  { id: 1, name: 'Professor A' },
  { id: 2, name: 'Professor B' },
];

const mattersMock = [
  { id: 1, name: 'Matemática' },
  { id: 2, name: 'História' },
];

const degreesMock = [
  { id: 1, name: '1ª Série' },
  { id: 2, name: '2ª Série' },
];

const classesMock = [
  { name: 'Classe A' },
  { name: 'Classe B' },
];

describe('NovoRelacionamentoForm', () => {
  const mockAddRelationship = jest.fn();

  const renderComponent = (relationshipToEdit = undefined) => {
    render(
      <DataContext.Provider
        value={{
          degrees: degreesMock,
          classes: classesMock,
          students: [],
          teachers: teachersMock,
          matters: mattersMock,
          relationships: [],
          updateStudent: jest.fn(),
          deleteStudent: jest.fn(),
          getFilteredStudents: jest.fn(),
          generateStudents: jest.fn(),
          addRelationship: mockAddRelationship,
          updateRelationship: jest.fn(),
          getRelationshipById: jest.fn(),
          deleteRelationship: jest.fn(),
        }}
      >
        <NovoRelacionamentoForm onClose={() => { }} relationshipToEdit={relationshipToEdit} />
      </DataContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os campos após clicar em Adicionar Série', async () => {
    renderComponent();

    expect(screen.getByTestId('teacher-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('matter-dropdown')).toBeInTheDocument();
    const toggleButton = screen.getByRole('button', { name: /adicionar série/i });
    fireEvent.click(toggleButton);

    expect(await screen.findByTestId('degree-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('class-multiselect')).toBeInTheDocument();
  });

  it('deve permitir selecionar valores nos dropdowns e multiselect', async () => {
    renderComponent();

    // Selecionar professor
    const teacherDropdown = screen.getByTestId('teacher-dropdown');
    fireEvent.click(teacherDropdown);
    fireEvent.click(await screen.getAllByText('Professor B')[0]);

    // Selecionar matéria
    const matterDropdown = screen.getByTestId('matter-dropdown');
    fireEvent.click(matterDropdown);
    fireEvent.click(await screen.getAllByText('Matemática')[0]);

    fireEvent.click(screen.getByRole('button', { name: /adicionar série/i }));

    // Selecionar série
    const degreeDropdown = screen.getByTestId('degree-dropdown');
    fireEvent.click(degreeDropdown);
    fireEvent.click(await screen.getAllByText('1ª Série')[0]);

    // Selecionar classes (multiselect)
    const classMultiSelect = screen.getByTestId('class-multiselect');
    fireEvent.click(classMultiSelect);
    fireEvent.click(await screen.getAllByText('Classe A')[0]);
    fireEvent.click(await screen.getAllByText('Classe B')[0]);

    // Simular envio do formulário
    const salvarBtn = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(salvarBtn);

    await waitFor(() => {
      expect(mockAddRelationship).toHaveBeenCalledWith({
        teacherId: 2,
        matterId: 1,
        id: expect.any(Number),
        degrees: [{ degreeId: 1, classes: [{ classId: 1 }, { classId: 2 }] }],
      });
    });
  });

  it('deve exibir erro se professor não for selecionado', async () => {
    renderComponent();
  
    // Abre o formulário
    const btnAdicionar = screen.getByRole('button', { name: /adicionar série/i });
    fireEvent.click(btnAdicionar);
  
    // Seleciona matéria
    const matterDropdown = screen.getByTestId('matter-dropdown');
    fireEvent.click(matterDropdown);
    fireEvent.click(await screen.getAllByText('Matemática')[0]);
  
    // Seleciona série e classes
    const degreeDropdown = screen.getByTestId('degree-dropdown');
    fireEvent.click(degreeDropdown);
    fireEvent.click(await screen.getAllByText('1ª Série')[0]);
    const classMultiSelect = screen.getByTestId('class-multiselect');
    fireEvent.click(classMultiSelect);
    fireEvent.click(await screen.getAllByText('Classe A')[0]);
    fireEvent.click(await screen.getAllByText('Classe B')[0]);
  
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
  
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Todos os campos são obrigatórios.');
      expect(mockAddRelationship).not.toHaveBeenCalled();
    });
  });

  it('deve exibir erro se matéria não for selecionada', async () => {
    renderComponent();
  
    // Seleciona professor
    const teacherDropdown = screen.getByTestId('teacher-dropdown');
    fireEvent.click(teacherDropdown);
    fireEvent.click(await screen.getAllByText('Professor B')[0]);
  
    // Abre o formulário
    const btnAdicionar = screen.getByRole('button', { name: /adicionar série/i });
    fireEvent.click(btnAdicionar);
  
    // Preenche série e classe
    const degreeDropdown = screen.getByTestId('degree-dropdown');
    fireEvent.click(degreeDropdown);
    fireEvent.click(await screen.getAllByText('1ª Série')[0]);
    const classMultiSelect = screen.getByTestId('class-multiselect');
    fireEvent.click(classMultiSelect);
    fireEvent.click(await screen.getAllByText('Classe A')[0]);
    fireEvent.click(await screen.getAllByText('Classe B')[0]);
  
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
  
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Todos os campos são obrigatórios.');
      expect(mockAddRelationship).not.toHaveBeenCalled();
    });
  });

  it('deve exibir erro se nenhuma série for adicionada', async () => {
    renderComponent();
  
    const teacherDropdown = screen.getByTestId('teacher-dropdown');
    fireEvent.click(teacherDropdown);
    fireEvent.click(await screen.getAllByText('Professor B')[0]);
  
    const matterDropdown = screen.getByTestId('matter-dropdown');
    fireEvent.click(matterDropdown);
    fireEvent.click(await screen.getAllByText('Matemática')[0]);
  
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));
  
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('É necessário selecionar pelo menos uma série e uma classe.');
      expect(mockAddRelationship).not.toHaveBeenCalled();
    });
  });
});
