import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import FiltrosRelacionamentos from '../components/FiltrosRelacionamentos';

// Mock del contexto
jest.mock('../context/DataContext', () => ({
    useDataContext: () => ({
        teachers: [
            { id: 1, name: 'Prof A' },
            { id: 2, name: 'Prof B' },
        ],
        matters: [
            { id: 1, name: 'Matéria X' },
            { id: 2, name: 'Matéria Y' },
        ],
        degrees: [
            { id: 1, name: 'Série 1' },
            { id: 2, name: 'Série 2' },
        ],
    }),
}));

describe('FiltrosRelacionamentos', () => {
    let onTeacherChange: jest.Mock;
    let onMatterChange: jest.Mock;
    let onDegreeChange: jest.Mock;
    let onClearFilters: jest.Mock;

    beforeEach(() => {
        onTeacherChange = jest.fn();
        onMatterChange = jest.fn();
        onDegreeChange = jest.fn();
        onClearFilters = jest.fn();

        render(
            <FiltrosRelacionamentos
                selectedTeacherId={null}
                selectedMatterId={null}
                selectedDegreeId={null}
                onTeacherChange={onTeacherChange}
                onMatterChange={onMatterChange}
                onDegreeChange={onDegreeChange}
                onClearFilters={onClearFilters}
            />
        );
    });

    it('deve permitir selecionar filtros e chamar a função de busca ', () => {
        const dropdownProfessor = screen.getByTestId('professor-filter');
        expect(dropdownProfessor).toBeInTheDocument();
        fireEvent.click(dropdownProfessor);
        const optionProf = screen.getAllByText('Prof B')[0];
        fireEvent.click(optionProf);
        expect(onTeacherChange).toHaveBeenCalledWith(2);

        const dropdownMatter = screen.getByTestId('matter-filter');
        expect(dropdownMatter).toBeInTheDocument();
        fireEvent.click(dropdownMatter);
        const optionMat = screen.getAllByText('Matéria Y')[0];
        fireEvent.click(optionMat);
        expect(onMatterChange).toHaveBeenCalledWith(2);

        const dropdownDegree = screen.getByTestId('degree-filter');
        expect(dropdownDegree).toBeInTheDocument();
        fireEvent.click(dropdownDegree);
        const optionDeg = screen.getAllByText('Série 2')[0];
        fireEvent.click(optionDeg);
        expect(onDegreeChange).toHaveBeenCalledWith(2);
    });

    it('deve limpar filtros ao clicar em Limpar', () => {
        const btnClear = screen.getByRole('button', { name: /Limpar/i });
        expect(btnClear).toBeInTheDocument();
        fireEvent.click(btnClear);
        expect(onClearFilters).toHaveBeenCalledTimes(1);
    });
});