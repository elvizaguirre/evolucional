import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import { useDataContext } from '../context/DataContext';

const FiltersWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const BotaoClaro = styled(Button)`
  background: white;
  border: 1px solid #ccc;
  color: #333;
  padding: 0.5rem 1rem;
  &:hover {
    border-color: #999;
  }
`;

interface Props {
    selectedTeacherId: number | null;
    selectedMatterId: number | null;
    selectedDegreeId: number | null;
    onTeacherChange: (value: number | null) => void;
    onMatterChange: (value: number | null) => void;
    onDegreeChange: (value: number | null) => void;
    onClearFilters: () => void;
}

const FiltrosRelacionamentos: React.FC<Props> = ({
    selectedTeacherId,
    selectedMatterId,
    selectedDegreeId,
    onTeacherChange,
    onMatterChange,
    onDegreeChange,
    onClearFilters,
}) => {
    const { teachers, matters, degrees } = useDataContext();

    return (
        <FiltersWrapper>
            <Dropdown
                value={selectedTeacherId}
                options={teachers.map((t) => ({ label: t.name, value: t.id }))}
                onChange={(e) => onTeacherChange(e.value)}
                placeholder="Professor"
                showClear
                style={{ width: '200px' }}
                filter
                data-testid="professor-filter"
            />

            <Dropdown
                value={selectedMatterId}
                options={matters.map((m) => ({ label: m.name, value: m.id }))}
                onChange={(e) => onMatterChange(e.value)}
                placeholder="Matéria"
                showClear
                style={{ width: '200px' }}
                filter
                data-testid="matter-filter"
            />

            <Dropdown
                value={selectedDegreeId}
                options={degrees.map((d) => ({ label: d.name, value: d.id }))}
                onChange={(e) => onDegreeChange(e.value)}
                placeholder="Série"
                showClear
                style={{ width: '200px' }}
                filter
                data-testid="degree-filter"
            />

            <BotaoClaro
                icon="pi pi-times"
                label="Limpar"
                role="button"
                name="Limpar"
                onClick={onClearFilters}
            />
        </FiltersWrapper>
    );
};

export default FiltrosRelacionamentos;