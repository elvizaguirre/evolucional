import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDataContext } from '../context/DataContext';
import { Student } from '../types';

interface Props {
    alunos: Student[];
    onEdit: (aluno: Student) => void;
    onDelete: (aluno: Student) => void;
}

const AlunoTable: React.FC<Props> = ({ alunos, onEdit, onDelete }) => {
    const { degrees, classes } = useDataContext();

    const getDegreeName = (student: Student) => {
        return degrees.find((d) => d.id === student.degreeId)?.name || '—';
    };

    const getClassName = (student: Student) => {
        return classes[student.classId -1]?.name || '—';
    };

    const actionTemplate = (rowData: Student) => (
        <>
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text"
                onClick={() => onEdit(rowData)}
                tooltip="Editar Aluno"
                name="Editar Aluno"
                role='button'
                tooltipOptions={{ position: 'top' }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                onClick={() => onDelete(rowData)}
                tooltip="Excluir Aluno"
                name="Excluir Aluno"
                role='button'
                tooltipOptions={{ position: 'top' }}
            />
        </>
    );

    return (
        <DataTable value={alunos} paginator rows={10} responsiveLayout="scroll">
            <Column field="name" header="Nome" sortable />
            <Column body={getDegreeName} header="Série" />
            <Column body={getClassName} header="Classe" />
            <Column
                body={actionTemplate}
                header="Ações"
                style={{ textAlign: 'center', width: '8rem' }}
            />
        </DataTable>
    );
};

export default AlunoTable;
