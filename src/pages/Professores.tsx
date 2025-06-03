import React, { useMemo, useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Relationship } from '../types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import NovoRelacionamentoForm from '../components/NovoRelacionamentoForm';
import { FaChevronDown, FaChevronRight, FaEdit, FaPlus, FaTrash, FaUserGraduate } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
`;

const FiltersWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

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

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StudentList = styled.div`
  margin-top: 10px;
  padding-left: 20px;
  font-size: 14px;
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

const Professores = () => {
    const {
        relationships,
        teachers,
        matters,
        degrees,
        classes,
        students,
        deleteRelationship,
    } = useDataContext();

    const [filtrosVisiveis, setFiltrosVisiveis] = useState(true);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
    const [selectedMatterId, setSelectedMatterId] = useState<number | null>(null);
    const [selectedDegreeId, setSelectedDegreeId] = useState<number | null>(null);
    const [expandedRelId, setExpandedRelId] = useState<number | null>(null);
    const [expandedStudentsDegreeId, setExpandedStudentsDegreeId] = useState<number | null>(null);
    const [editRel, setEditRel] = useState<Relationship | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [relToDelete, setRelToDelete] = useState<Relationship | null>(null);

    const relationshipsFiltradas = useMemo(() => {
        return relationships.filter((rel) => {
            if (selectedTeacherId && rel.teacherId !== selectedTeacherId) return false;
            if (selectedMatterId && rel.matterId !== selectedMatterId) return false;
            if (selectedDegreeId && !rel.degrees.find((d) => d.degreeId === selectedDegreeId)) return false;
            return true;
        });
    }, [relationships, selectedTeacherId, selectedMatterId, selectedDegreeId]);

    return (
        <Container>
            <HeaderWrapper>
                <Button
                    label={filtrosVisiveis ? 'Ocultar Filtros' : 'Mostrar Filtros'}
                    icon={filtrosVisiveis ? 'pi pi-eye-slash' : 'pi pi-filter'}
                    onClick={() => setFiltrosVisiveis((prev) => !prev)}
                    className="p-button-sm p-button-primary"
                    name={filtrosVisiveis ? 'ocultar filtros' : 'mostrar filtros'}
                />

                <Button
                    icon={<FaPlus />} label="Novo Relacionamento"
                    className="p-button-sm p-button-primary"
                    role="button"
                    name="adicionar relacionamento"
                    onClick={() => {
                        setEditRel(null);
                        setShowForm(true);
                    }}
                />
            </HeaderWrapper>

            {filtrosVisiveis && (
                <FiltersWrapper>
                    <Dropdown
                        value={selectedTeacherId}
                        options={teachers.map((t) => ({ label: t.name, value: t.id }))}
                        onChange={(e) => setSelectedTeacherId(e.value)}
                        placeholder="Professor"
                        showClear
                        style={{ width: '200px' }}
                        filter
                    />
                    <Dropdown
                        value={selectedMatterId}
                        options={matters.map((m) => ({ label: m.name, value: m.id }))}
                        onChange={(e) => setSelectedMatterId(e.value)}
                        placeholder="Matéria"
                        showClear
                        style={{ width: '200px' }}
                        filter
                    />
                    <Dropdown
                        value={selectedDegreeId}
                        options={degrees.map((d) => ({ label: d.name, value: d.id }))}
                        onChange={(e) => setSelectedDegreeId(e.value)}
                        placeholder="Série"
                        showClear
                        style={{ width: '200px' }}
                        filter
                    />

                    <BotaoClaro
                        icon="pi pi-times"
                        label="Limpar"
                        role="button"
                        name="limpar filtros"
                        onClick={() => {
                            setSelectedMatterId(null);
                            setSelectedDegreeId(null);
                        }}
                    />
                </FiltersWrapper>
            )}

            {relationshipsFiltradas.map((rel) => {
                const teacher = teachers.find((t) => t.id === rel.teacherId);
                const matter = matters.find((m) => m.id === rel.matterId);

                return (
                    <RelationshipCard key={rel.id}>
                        <RelRow>
                            <strong onClick={() => setExpandedRelId(expandedRelId === rel.id ? null : rel.id)}>
                                {teacher?.name} - {matter?.name}
                            </strong>
                            <div>
                                <Button
                                    icon={<FaEdit />}
                                    className="p-button-text"
                                    tooltip="Editar Relacionamento"
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => {
                                        setEditRel(rel);
                                        setShowForm(true);
                                    }}
                                    style={{ marginRight: '0.5rem' }}
                                    role="button"
                                    name="editar relacao"
                                />
                                <Button
                                    icon={<FaTrash />}
                                    className="p-button-text p-button-danger"
                                    tooltip="Remover Relacionamento"
                                    tooltipOptions={{ position: 'top' }}
                                    onClick={() => setRelToDelete(rel)}
                                    style={{ marginRight: '0.5rem' }}
                                    role="button"
                                    name="remove relacao"
                                />
                                <Button
                                    icon={expandedRelId === rel.id ? <FaChevronDown /> : <FaChevronRight />}
                                    className="p-button-text"
                                    onClick={() => setExpandedRelId(expandedRelId === rel.id ? null : rel.id)}
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
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span>
                                                    <strong>{degree?.name}</strong>: {d.classes.map((c) => classes[((c.classId || c.classPosition) ?? 1) - 1]?.name).join(', ')}
                                                </span>
                                                <Button
                                                    icon={<FaUserGraduate />}
                                                    className="p-button-text p-button-sm"
                                                    tooltip="Mostrar Alunos"
                                                    tooltipOptions={{ position: 'top' }}
                                                    onClick={() => setExpandedStudentsDegreeId(expandedStudentsDegreeId === d.degreeId ? null : d.degreeId)}
                                                    role="button"
                                                    name="mostra alunos"
                                                />
                                            </div>
                                            {expandedStudentsDegreeId === d.degreeId && (
                                                <StudentList>
                                                    {students
                                                        .filter((s) =>
                                                            s.degreeId === d.degreeId &&
                                                            d.classes.some((c) => s.classId === (c.classId ?? c.classPosition))
                                                        )
                                                        .sort((a, b) => (a.classId ?? 0) - (b.classId ?? 0))
                                                        .map((s) => (
                                                            <div key={s.id}>
                                                                {s.name} ({classes[(s.classId ?? 1) - 1]?.name})
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

            <Dialog blockScroll={false} header={editRel ? '✏️ Editar Relacionamento' : '➕ Novo Relacionamento'} visible={showForm} style={{ width: '600px' }} onHide={() => setShowForm(false)} modal>
                <NovoRelacionamentoForm onClose={() => setShowForm(false)} relationshipToEdit={editRel ?? undefined} />
            </Dialog>

            <Dialog
                blockScroll={false}
                header="Confirmar Exclusão"
                visible={!!relToDelete}
                style={{ width: '400px' }}
                onHide={() => setRelToDelete(null)}
                modal
                footer={
                    <>
                        <Button label="Cancelar" onClick={() => setRelToDelete(null)} className="p-button-text" />
                        <Button
                            label="Excluir"
                            role="button"
                            name="confirma remove"
                            onClick={() => {
                                if (relToDelete) deleteRelationship(relToDelete.id);
                                setRelToDelete(null);
                            }}
                            className="p-button-danger"
                        />
                    </>
                }
            >
                Tem certeza que deseja excluir este relacionamento?
            </Dialog>
        </Container>
    );
};

export default Professores;
