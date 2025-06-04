import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RelacionamentoTable from '../components/RelacionamentoTable';

// Mock del contexto
jest.mock('../context/DataContext', () => ({
    useDataContext: () => ({
        teachers: [{ id: 1, name: 'Prof A' }],
        matters: [{ id: 1, name: 'Matéria X' }],
        degrees: [{ id: 1, name: 'Série 1' }],
        classes: [{ name: 'Classe Alpha' }],
        students: [
            {
                id: 10,
                name: 'Aluno Teste',
                degreeId: 1,
                classId: 1,
            },
        ],
        relations: [
            {
                id: 42,
                teacherId: 1,
                matterId: 1,
                degrees: [
                    {
                        degreeId: 1,
                        classes: [{ classPosition: 1 }],
                    },
                ],
            },
        ]
    }),
}));

describe('RelacionamentoTable', () => {
    const singleRelationship = [
        {
            id: 42,
            teacherId: 1,
            matterId: 1,
            degrees: [
                {
                    degreeId: 1,
                    classes: [{ classPosition: 1 }],
                },
            ],
        },
    ];

    let onToggleRel: jest.Mock;
    let onToggleStudents: jest.Mock;
    let onEditRel: jest.Mock;
    let onDeleteRel: jest.Mock;

    beforeEach(() => {
        onToggleRel = jest.fn();
        onToggleStudents = jest.fn();
        onEditRel = jest.fn();
        onDeleteRel = jest.fn();

        render(
            <RelacionamentoTable
                relationships={singleRelationship}
                expandedRelId={null}
                expandedStudentsDegreeId={null}
                onToggleRel={onToggleRel}
                onToggleStudents={onToggleStudents}
                onEditRel={onEditRel}
                onDeleteRel={onDeleteRel}
            />
        );
    });

    it('deve renderizar a lista de professores e relacionamentos', () => {
        expect(screen.getByText('Prof A - Matéria X')).toBeInTheDocument();
    });

    it('onToggleRel com o id correto ao clicar no header', () => {
        const headerElement = screen.getByText('Prof A - Matéria X');
        fireEvent.click(headerElement);
        expect(onToggleRel).toHaveBeenCalledWith(42);
    });

    it('onEditRel ao clicar em editar', () => {
        const btnEdit = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'editar relacao')[0];
        expect(btnEdit).toBeInTheDocument();
        fireEvent.click(btnEdit);
        expect(onEditRel).toHaveBeenCalledWith(singleRelationship[0]);
    });

    it('onDeleteRel ao clicar em eliminar', () => {
        const btnDelete = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'remove relacao')[0];
        expect(btnDelete).toBeInTheDocument();
        fireEvent.click(btnDelete);
        expect(onDeleteRel).toHaveBeenCalledWith(singleRelationship[0]);
    });

    it('onToggleRel de novo ao clicar no icone de seta', () => {
        const btnToggleRel = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'abre relacao')[0];
        expect(btnToggleRel).toBeInTheDocument();
        fireEvent.click(btnToggleRel);
        expect(onToggleRel).toHaveBeenCalledWith(42);
    });

    it('ao expandir mostra detalhes de séries y clases, e ao mostrar alunos invoca onToggleStudents', () => {
        render(
            <RelacionamentoTable
                relationships={singleRelationship}
                expandedRelId={42}
                expandedStudentsDegreeId={null}
                onToggleRel={onToggleRel}
                onToggleStudents={onToggleStudents}
                onEditRel={onEditRel}
                onDeleteRel={onDeleteRel}
            />
        );
        expect(screen.getByText('Série 1')).toBeInTheDocument();
        expect(screen.getByText(': Classe Alpha')).toBeInTheDocument();

        const btnShowStudents = screen.getAllByRole('button').filter(btn => btn.getAttribute('name') === 'mostra alunos')[0];
        expect(btnShowStudents).toBeInTheDocument();
        fireEvent.click(btnShowStudents);
        expect(onToggleStudents).toHaveBeenCalledWith(1);
    });

    it('mostra lista de alunos filtrados quando expandedStudentsDegreeId coincide', () => {
        render(
            <RelacionamentoTable
                relationships={singleRelationship}
                expandedRelId={42}
                expandedStudentsDegreeId={1}
                onToggleRel={onToggleRel}
                onToggleStudents={onToggleStudents}
                onEditRel={onEditRel}
                onDeleteRel={onDeleteRel}
            />
        );

        // Ahora debería aparecer el alumno “Aluno Teste” seguido de su clase "Classe Alpha"
        expect(screen.getByText(/Aluno Teste/)).toBeInTheDocument();
        expect(screen.getByText(/\(Classe Alpha\)/)).toBeInTheDocument();
    });
});