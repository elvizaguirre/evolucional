import React, { useState } from 'react';
import styled from 'styled-components';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useDataContext } from '../context/DataContext';

interface Props {
    selectedDegreeId: number | undefined;
    selectedClassId: number | undefined;
    onDegreeChange: (value: number | undefined) => void;
    onClassChange: (value: number | undefined) => void;
}

const FiltroWrapper = styled.div`
  margin-bottom: 1.5rem;
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const LinhaFiltros = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const FiltroDropdown = styled(Dropdown)`
  width: 250px;
  min-width: 250px;

  .p-dropdown-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .p-inputtext {
    padding-right: 2.5rem !important;
  }

  .p-dropdown-clear-icon {
    right: 2.5rem !important;
  }

  .p-dropdown-trigger {
    right: 0.5rem;
  }
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

const FiltrosAlunos: React.FC<Props> = ({
    selectedDegreeId,
    selectedClassId,
    onDegreeChange,
    onClassChange,
}) => {
    const { degrees, classes } = useDataContext();
    const [mostrarFiltros, setMostrarFiltros] = useState(true);

    if (!mostrarFiltros) {
        return (
            <div style={{ marginBottom: '1rem' }}>
                <Button
                    icon="pi pi-filter"
                    label="Mostrar Filtros"
                    name="Mostrar Filtros"
                    role="button"
                    onClick={() => setMostrarFiltros(true)}
                />
            </div>
        );
    }

    return (
        <FiltroWrapper>
            <LinhaFiltros>
                <FiltroDropdown
                    value={selectedDegreeId}
                    options={degrees.map((d) => ({ label: d.name, value: d.id }))}
                    onChange={(e) => onDegreeChange(e.value)}
                    placeholder="Filtrar por Série"
                    showClear
                    filter
                    data-testid="degree-dropdown"
                />

                <FiltroDropdown
                    value={selectedClassId}
                    options={classes.map((c, index) => ({ label: c.name, value: index+1 }))}
                    onChange={(e) => onClassChange(e.value)}
                    placeholder="Filtrar por Classe"
                    showClear
                    filter
                    data-testid="class-dropdown"
                />

                <BotaoClaro
                    icon="pi pi-times"
                    label="Limpar"
                    onClick={() => {
                        onDegreeChange(undefined);
                        onClassChange(undefined);
                    }}
                />

                <Button
                    icon="pi pi-eye-slash"
                    label="Ocultar Filtros"
                    name="Ocultar Filtros"
                    role="button"
                    onClick={() => setMostrarFiltros(false)}
                />
            </LinhaFiltros>
        </FiltroWrapper>
    );
};

export default FiltrosAlunos;