import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Professores from '../../src/pages/Professores';
import { DataContext } from '../../src/context/DataContext';
import '@testing-library/jest-dom';

const teachersMock = [
  { id: 1, name: 'Professor A' },
  { id: 2, name: 'Professor B' },
];

const mattersMock = [
  { id: 1, name: 'Matemática' },
];

const degreesMock = [
  { id: 1, name: 'Série1' },
];

const classesMock = [
  { name: 'Classe A' },
  { name: 'Classe B' },
];

const relationshipsMock = [
  {
    id: 1,
    teacherId: 1,
    matterId: 1,
    degrees: [{ degreeId: 1, classes: [{ classId: 1 }] }],
  },
];

describe('Professores', () => {

  const renderPage = () =>
    render(
      <DataContext.Provider value={{
        students: [],
        degrees: degreesMock,
        classes: classesMock,
        teachers: teachersMock,
        matters: mattersMock,
        relationships: relationshipsMock,
        updateStudent: jest.fn(),
        deleteStudent: jest.fn(),
        getFilteredStudents: jest.fn(),
        generateStudents: jest.fn(),
        addRelationship: jest.fn(),
        updateRelationship: jest.fn(),
        getRelationshipById: jest.fn(),
        deleteRelationship: jest.fn(),
      }}>
        <Professores />
      </DataContext.Provider>
    );

  it('deve renderizar a lista de professores e relacionamentos', () => {
    renderPage();

    expect(screen.getByText('Professor A - Matemática')).toBeInTheDocument();
    const toggleButton = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'abre relacao');
    fireEvent.click(toggleButton[0]);

    expect(screen.getByText('Série1')).toBeInTheDocument();
  });

  it('deve alternar exibição dos filtros ao clicar em mostrar/ocultar filtros', () => {
    renderPage();

    const toggleButton = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'ocultar filtros');
    expect(toggleButton[0]).toBeInTheDocument();

    fireEvent.click(toggleButton[0]);
    expect(screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'mostrar filtros')[0]).toBeInTheDocument();
  });

  it('deve limpar os filtros ao clicar em "Limpar Filtros"', () => {
    renderPage();

    const clearButton = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'limpar filtros');
    expect(clearButton[0]).toBeInTheDocument();
    fireEvent.click(clearButton[0]);

    // Não deve lançar erro
  });

  it('deve abrir o modal de novo relacionamento ao clicar em "Adicionar Relacionamento"', () => {
    renderPage();

    const btnAdd = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'adicionar relacionamento');
    expect(btnAdd[0]).toBeInTheDocument();

    fireEvent.click(btnAdd[0]);

    expect(screen.getByText("➕ Novo Relacionamento")).toBeInTheDocument();
  });

  it('deve exibir botão de editar relacionamento', () => {
    renderPage();
    const toggleButton = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'abre relacao');
    fireEvent.click(toggleButton[0]);

    const btnEdit = screen.getAllByRole('button').find(btn => btn.getAttribute('name') === 'editar relacao');
    expect(btnEdit).toBeInTheDocument();
  });

  it('deve exibir botão de remover relacionamento', () => {
    renderPage();
    const toggleButton = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'abre relacao');
    fireEvent.click(toggleButton[0]);

    const btnRemove = screen.getAllByRole('button').find(btn => btn.getAttribute('name') === 'remove relacao');
    expect(btnRemove).toBeInTheDocument();
  });

  it('deve exibir botão "Mostrar alunos"', () => {
    renderPage();
    const toggleButton = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'abre relacao');
    fireEvent.click(toggleButton[0]);

    const btnAlunos = screen.getAllByRole('button').find(btn => btn.getAttribute('name') === 'mostra alunos');
    expect(btnAlunos).toBeInTheDocument();
  });
});
