import React, { useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Card } from 'primereact/card';
import AlunoTable from '../components/AlunoTable';
import EditarAlunoModal from '../components/EditarAlunoModal';
import FiltrosAlunos from '../components/FiltrosAlunos';
import { Student } from '../types';
import styled from 'styled-components';
import Chart from 'react-apexcharts';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

const StyledCard = styled(Card)`
  .p-card-body {
    padding: 10px;
  }
`;

const TableWrapper = styled.div`
  margin-bottom: 2rem;
`;

const ChartWrapper = styled.div`
  margin-bottom: 2rem;
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const Alunos: React.FC = () => {
    const { getFilteredStudents, updateStudent, generateStudents, students, degrees, deleteStudent } = useDataContext();

    const [selectedDegreeId, setSelectedDegreeId] = useState<number | undefined>();
    const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
    const [alunoSelecionado, setAlunoSelecionado] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [mostrarGrafico, setMostrarGrafico] = useState(true);

    const alunosFiltrados = getFilteredStudents(selectedDegreeId, selectedClassId);

    const dataByDegree = degrees.map((degree) => {
        const count = students.filter((s) => s.degreeId === degree.id).length;
        return { name: degree.name, count };
    });

    const chartOptions = {
        chart: { id: 'students-by-degree' },
        xaxis: {
            categories: dataByDegree.map((d) => d.name),
            labels: {
                trim: false,
                style: { fontSize: '11px' }
            }
        },
        yaxis: {
            title: { text: 'Cantidad de Alunos' },
            labels: { formatter: (val: number) => `${val} alunos` }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} alunos`
            }
        }
    };

    const chartSeries = [
        {
            name: 'Alunos',
            data: dataByDegree.map((d) => d.count),
        },
    ];

    return (
        <StyledCard title="Gerenciamento de Alunos">
            <HeaderActions>
                <Button
                    label="Gerar 300 Alunos"
                    icon="pi pi-plus"
                    onClick={generateStudents}
                    role="button"
                    name="gerar alunos"
                />
            </HeaderActions>

            <ToggleWrapper>
                <Button
                    label={mostrarGrafico ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
                    icon="pi pi-chart-bar"
                    onClick={() => setMostrarGrafico((prev) => !prev)}
                    className="p-button-text"
                    role="button"
                    name={mostrarGrafico ? 'ocultar gráfico' : 'mostrar gráfico'}
                />
            </ToggleWrapper>

            {mostrarGrafico && (
                <ChartWrapper>
                    <Chart options={chartOptions} series={chartSeries} type="bar" height={400} />
                </ChartWrapper>
            )}

            <FiltrosAlunos
                selectedDegreeId={selectedDegreeId}
                selectedClassId={selectedClassId}
                onDegreeChange={setSelectedDegreeId}
                onClassChange={setSelectedClassId}
            />

            <TableWrapper>
                <AlunoTable
                    alunos={alunosFiltrados}
                    onEdit={(aluno) => setAlunoSelecionado(aluno)}
                    onDelete={(aluno) => setStudentToDelete(aluno)}
                />
            </TableWrapper>

            {alunoSelecionado && (
                <EditarAlunoModal
                    aluno={alunoSelecionado}
                    onHide={() => setAlunoSelecionado(null)}
                    onSave={(updated) => {
                        updateStudent(updated);
                        setAlunoSelecionado(null);
                    }}
                />
            )}

            <Dialog
                blockScroll={false}
                header="Confirmar Exclusão"
                visible={!!studentToDelete}
                style={{ width: '400px' }}
                onHide={() => setStudentToDelete(null)}
                modal
                footer={
                    <>
                        <Button label="Cancelar" onClick={() => setStudentToDelete(null)} role="button" className="p-button-text" />
                        <Button
                            label="Excluir"
                            onClick={() => {
                                if (studentToDelete) deleteStudent(studentToDelete.id);
                                setStudentToDelete(null);
                            }}
                            className="p-button-danger"
                            role="button"
                        />
                    </>
                }
            >
                Tem certeza que deseja excluir este aluno?
            </Dialog>
        </StyledCard>
    );
};

export default Alunos;
