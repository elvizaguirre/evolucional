import React, { useMemo, useState } from 'react';
import { useDataContext } from '../context/DataContext';
import { Relationship } from '../types';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import NovoRelacionamentoForm from '../components/NovoRelacionamentoForm';
import FiltrosRelacionamentos from '../components/FiltrosRelacionamentos';
import RelacionamentoTable from '../components/RelacionamentoTable';
import { FaPlus } from 'react-icons/fa';

const Container = styled.div`
  padding: 20px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const Professores = () => {
    const {
        relationships,
        deleteRelationship,
    } = useDataContext();

    const [filtrosVisiveis, setFiltrosVisiveis] = useState(true);
    const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
        null
    );
    const [selectedMatterId, setSelectedMatterId] = useState<number | null>(
        null
    );
    const [selectedDegreeId, setSelectedDegreeId] = useState<number | null>(
        null
    );
    const [expandedRelId, setExpandedRelId] = useState<number | null>(null);
    const [expandedStudentsDegreeId, setExpandedStudentsDegreeId] = useState<
        number | null
    >(null);
    const [editRel, setEditRel] = useState<Relationship | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [relToDelete, setRelToDelete] = useState<Relationship | null>(null);

    const relationshipsFiltradas = useMemo(() => {
        return relationships.filter((rel) => {
            if (selectedTeacherId && rel.teacherId !== selectedTeacherId)
                return false;
            if (selectedMatterId && rel.matterId !== selectedMatterId) return false;
            if (
                selectedDegreeId &&
                !rel.degrees.find((d) => d.degreeId === selectedDegreeId)
            )
                return false;
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
                    icon={<FaPlus />}
                    label="Novo Relacionamento"
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
                <FiltrosRelacionamentos
                    selectedTeacherId={selectedTeacherId}
                    selectedMatterId={selectedMatterId}
                    selectedDegreeId={selectedDegreeId}
                    onTeacherChange={setSelectedTeacherId}
                    onMatterChange={setSelectedMatterId}
                    onDegreeChange={setSelectedDegreeId}
                    onClearFilters={() => {
                        setSelectedMatterId(null);
                        setSelectedDegreeId(null);
                    }}
                />
            )}

            <Card>
                <RelacionamentoTable
                    relationships={relationshipsFiltradas}
                    expandedRelId={expandedRelId}
                    expandedStudentsDegreeId={expandedStudentsDegreeId}
                    onToggleRel={(relId) =>
                        setExpandedRelId(expandedRelId === relId ? null : relId)
                    }
                    onToggleStudents={(degreeId) =>
                        setExpandedStudentsDegreeId(
                            expandedStudentsDegreeId === degreeId ? null : degreeId
                        )
                    }
                    onEditRel={(rel) => {
                        setEditRel(rel);
                        setShowForm(true);
                    }}
                    onDeleteRel={(rel) => setRelToDelete(rel)}
                />
            </Card>

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
                        <Button
                            label="Cancelar"
                            onClick={() => setRelToDelete(null)}
                            className="p-button-text"
                        />
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