import React from 'react';
import { useDataContext } from '../context/DataContext';
import { Relationship, Student } from '../types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import styled from 'styled-components';
import {
    FaChevronDown,
    FaChevronRight,
    FaEdit,
    FaTrash,
    FaUserGraduate,
} from 'react-icons/fa';

/**
 * Usamos exactamente los mismos styled-components que tenías en el original.
 */
const RelationshipCard = styled(Card)`
  margin-bottom: 10px;
`;

const RelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RelationshipDetails = styled.div`
  padding-left: 20px;
  padding-top: 10px;
`;

const StudentList = styled.div`
  margin-top: 10px;
  padding-left: 20px;
  font-size: 14px;
`;

interface Props {
    relationships: Relationship[];
    expandedRelId: number | null;
    expandedStudentsDegreeId: number | null;
    onToggleRel: (relId: number | null) => void;
    onToggleStudents: (degreeId: number | null) => void;
    onEditRel: (rel: Relationship) => void;
    onDeleteRel: (rel: Relationship) => void;
}

const RelacionamentoTable: React.FC<Props> = ({
    relationships,
    expandedRelId,
    expandedStudentsDegreeId,
    onToggleRel,
    onToggleStudents,
    onEditRel,
    onDeleteRel,
}) => {
    const { teachers, matters, degrees, classes, students } = useDataContext();

    return (
        <>
            {relationships.map((rel) => {
                const teacher = teachers.find((t) => t.id === rel.teacherId);
                const matter = matters.find((m) => m.id === rel.matterId);

                return (
                    <RelationshipCard key={rel.id}>
                        <RelRow>
                            <strong
                                onClick={() =>
                                    onToggleRel(expandedRelId === rel.id ? null : rel.id)
                                }
                                style={{ cursor: 'pointer' }}
                            >
                                {teacher?.name} - {matter?.name}
                            </strong>
                            <div>
                                <Button
                                    icon={<FaEdit />}
                                    className="p-button-text"
                                    tooltip="Editar Relacionamento"
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => onEditRel(rel)}
                                    style={{ marginRight: '0.5rem' }}
                                    role="button"
                                    name="editar relacao"
                                />
                                <Button
                                    icon={<FaTrash />}
                                    className="p-button-text p-button-danger"
                                    tooltip="Remover Relacionamento"
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => onDeleteRel(rel)}
                                    style={{ marginRight: '0.5rem' }}
                                    role="button"
                                    name="remove relacao"
                                />
                                <Button
                                    icon={
                                        expandedRelId === rel.id ? (
                                            <FaChevronDown />
                                        ) : (
                                            <FaChevronRight />
                                        )
                                    }
                                    className="p-button-text"
                                    onClick={() =>
                                        onToggleRel(expandedRelId === rel.id ? null : rel.id)
                                    }
                                    role="button"
                                    name="abre relacao"
                                />
                            </div>
                        </RelRow>

                        {expandedRelId === rel.id && (
                            <RelationshipDetails>
                                {rel.degrees.map((d, idx) => {
                                    const degree = degrees.find((dg) => dg.id === d.degreeId);

                                    return (
                                        <div key={idx}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                }}
                                            >
                                                <span>
                                                    <strong>{degree?.name}</strong>:{' '}
                                                    {d.classes
                                                        .map((c) => {
                                                            const idxClasse =
                                                                ((c.classId || c.classPosition) ?? 1) - 1;
                                                            return classes[idxClasse]?.name;
                                                        })
                                                        .join(', ')}
                                                </span>
                                                <Button
                                                    icon={<FaUserGraduate />}
                                                    className="p-button-text p-button-sm"
                                                    tooltip="Mostrar Alunos"
                                                    tooltipOptions={{ position: 'top' }}
                                                    onClick={() =>
                                                        onToggleStudents(
                                                            expandedStudentsDegreeId === d.degreeId
                                                                ? null
                                                                : d.degreeId
                                                        )
                                                    }
                                                    role="button"
                                                    name="mostra alunos"
                                                />
                                            </div>

                                            {expandedStudentsDegreeId === d.degreeId && (
                                                <StudentList>
                                                    {students
                                                        .filter(
                                                            (s) =>
                                                                s.degreeId === d.degreeId &&
                                                                d.classes.some(
                                                                    (c) =>
                                                                        s.classId ===
                                                                        (c.classId ?? c.classPosition)
                                                                )
                                                        )
                                                        .sort((a, b) => (a.classId ?? 0) - (b.classId ?? 0))
                                                        .map((s) => (
                                                            <div key={s.id}>
                                                                {s.name} (
                                                                {classes[(s.classId ?? 1) - 1]?.name})
                                                            </div>
                                                        ))}
                                                </StudentList>
                                            )}
                                        </div>
                                    );
                                })}
                            </RelationshipDetails>
                        )}
                    </RelationshipCard>
                );
            })}
        </>
    );
};

export default RelacionamentoTable;