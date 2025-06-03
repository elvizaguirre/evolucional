import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import EditarAlunoModal from '../components/EditarAlunoModal';
import { DataContext } from '../context/DataContext';

const alunoMock = {
  id: 1,
  ra: 456412,
  name: 'Aluno Teste',
  degreeId: 1,
  classId: 1,
};

const degreesMock = [
  { id: 1, name: '1ª Série' },
  { id: 2, name: '2ª Série' },
];

const classesMock = [
  { name: 'Classe A' },
  { name: 'Classe B' },
];

describe('EditarAlunoModal', () => {
  const onHide = jest.fn();
  const onSave = jest.fn();

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
          deleteRelationship: jest.fn()
        }}
      >
        <EditarAlunoModal aluno={alunoMock} onHide={onHide} onSave={onSave} />
      </DataContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar os campos com os dados do aluno', async () => {
    renderComponent();

    const inputNome = screen.getByTestId('nome-input') as HTMLInputElement;
    expect(inputNome).toBeInTheDocument();
    expect(inputNome.value).toBe('Aluno Teste');

    const allOptionsSerie = screen.getAllByText('1ª Série');
    expect(allOptionsSerie.length).toBeGreaterThan(0);

    const allOptionsClasse = screen.getAllByText('Classe A');
    expect(allOptionsClasse.length).toBeGreaterThan(0);
  });

  it('deve exibir erro ao tentar salvar com campos vazios', () => {
    renderComponent();

    const inputNome = screen.getByTestId('nome-input') as HTMLInputElement;
    fireEvent.change(inputNome, { target: { value: '   ' } });

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(screen.getByTestId('error-message')).toHaveTextContent('Todos os campos são obrigatórios.');
  });

  it('deve chamar onSave corretamente ao preencher todos os campos', async () => {
    renderComponent();

    const inputNome = screen.getByTestId('nome-input') as HTMLInputElement;
    fireEvent.change(inputNome, { target: { value: 'Novo Nome' } });

    const dropdownSerie = screen.getByTestId('degree-dropdown');
    fireEvent.click(dropdownSerie);
    const optionSerie = screen.getAllByText('1ª Série')[0];
    fireEvent.click(optionSerie);

    const dropdownClasse = screen.getByTestId('class-dropdown');
    fireEvent.click(dropdownClasse);
    const optionClasse = screen.getAllByText('Classe A')[0];
    fireEvent.click(optionClasse);

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(onSave).toHaveBeenCalledWith({
      ...alunoMock,
      name: 'Novo Nome',
      classId: 1,
      degreeId: 1,
    });
  });

  it('deve chamar onHide ao clicar em cancelar', () => {
    renderComponent();

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    expect(onHide).toHaveBeenCalled();
  });

  it('deve alterar a série (degree) corretamente', async () => {
    renderComponent();

    const dropdownSerie = screen.getByTestId('degree-dropdown');
    fireEvent.click(dropdownSerie);
    const option = screen.getAllByText('2ª Série')[0];
    fireEvent.click(option);

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(onSave).toHaveBeenCalledWith({
      ...alunoMock,
      name: 'Aluno Teste',
      classId: 1,
      degreeId: 2,
    });
  });

  it('deve alterar a classe corretamente', async () => {
    renderComponent();

    const dropdownClasse = screen.getByTestId('class-dropdown');
    fireEvent.click(dropdownClasse);
    const option = screen.getAllByText('Classe B')[0];
    fireEvent.click(option);

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(onSave).toHaveBeenCalledWith({
      ...alunoMock,
      name: 'Aluno Teste',
      classId: 2,
      degreeId: 1,
    });
  });
});
