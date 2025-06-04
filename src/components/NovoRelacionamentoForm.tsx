import React, { useEffect, useState, useRef } from 'react';
import { useDataContext } from '../context/DataContext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import styled from 'styled-components';
import { Relationship } from '../types';
import { FaTrash } from 'react-icons/fa';

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px;
`;

const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  label {
    font-weight: 600;
    font-size: 14px;
  }

  .p-dropdown,
  .p-multiselect {
    width: 100% !important;
  }
`;

const DegreeBlock = styled.div`
  border: 1px solid #ccc;
  padding: 2rem 1rem 1rem 1rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
`;

const DegreeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const RemoveSerieButton = styled(Button)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
`;

interface Props {
    onClose: () => void;
    relationshipToEdit?: Relationship;
    registerHideDropdownHandler?: (fn: () => void) => void;
}

const NovoRelacionamentoForm: React.FC<Props> = ({ onClose, relationshipToEdit, registerHideDropdownHandler }) => {
    const { teachers, matters, degrees, classes, addRelationship, updateRelationship } = useDataContext();
    const [teacherId, setTeacherId] = useState<number | null>(0);
    const [matterId, setMatterId] = useState<number | null>(0);
    const [degreeClasses, setDegreeClasses] = useState<{
        degreeId: number;
        classIds: number[];
    }[]>([]);
    const [showError, setShowError] = useState(false);

    const dropdownRefs = useRef<Record<string, any>>({});
    const hideAllDropdowns = () => {
        event?.stopImmediatePropagation();
        Object.values(dropdownRefs.current).forEach((ref) => ref?.hide?.());
    };

    useEffect(() => {
        registerHideDropdownHandler?.(() => hideAllDropdowns());
    }, [registerHideDropdownHandler]);

    useEffect(() => {
        if (relationshipToEdit) {
            setTeacherId(relationshipToEdit.teacherId);
            setMatterId(relationshipToEdit.matterId);
            setDegreeClasses(
                relationshipToEdit.degrees.map((d) => ({
                    degreeId: d.degreeId,
                    classIds: d.classes.map((c) => c.classId ?? c.classPosition ?? 1),
                }))
            );
        }
    }, [relationshipToEdit]);

    const handleAddDegree = () => {
        setDegreeClasses([...degreeClasses, { degreeId: degrees[0].id, classIds: [1] }]);
    };

    const handleRemoveDegree = (index: number) => {
        const updated = [...degreeClasses];
        updated.splice(index, 1);
        setDegreeClasses(updated);
    };

    const handleSave = () => {
        if (!teacherId || !matterId || degreeClasses.length === 0 || degreeClasses.some(dc => dc.classIds.length === 0)) {
            setShowError(true);
            return;
        }

        const newRel: Relationship = {
            id: relationshipToEdit?.id ?? Date.now(),
            teacherId,
            matterId,
            degrees: degreeClasses.map((dc) => ({
                degreeId: dc.degreeId,
                classes: dc.classIds.map((cid) => ({ classId: cid })),
            })),
        };

        if (relationshipToEdit) {
            updateRelationship(newRel);
        } else {
            addRelationship(newRel);
        }

        onClose();
    };

    return (
        <>
            <FormWrapper onScroll={hideAllDropdowns}>
                <Campo>
                    <label>Professor</label>
                    <Dropdown
                        value={teacherId}
                        options={teachers.map((t) => ({ label: t.name, value: t.id }))}
                        onChange={(e) => setTeacherId(e.value)}
                        placeholder="Selecione um Professor"
                        showClear
                        ref={(el) => {dropdownRefs.current['teacher'] = el}}
                        data-testid="teacher-dropdown"
                    />
                </Campo>

                <Campo>
                    <label>Matéria</label>
                    <Dropdown
                        value={matterId}
                        options={matters.map((m) => ({ label: m.name, value: m.id }))}
                        onChange={(e) => setMatterId(e.value)}
                        placeholder="Selecione uma Matéria"
                        showClear
                        ref={(el) => {dropdownRefs.current['matter'] = el}}
                        data-testid="matter-dropdown"
                    />
                </Campo>

                {degreeClasses.map((dc, index) => (
                    <DegreeBlock key={index}>
                        <RemoveSerieButton icon={<FaTrash />} className="p-button-danger" onClick={() => handleRemoveDegree(index)} />
                        <DegreeGrid>
                            <Campo>
                                <label>Série</label>
                                <Dropdown
                                    value={dc.degreeId}
                                    options={degrees.map((d) => ({ label: d.name, value: d.id }))}
                                    onChange={(e) => {
                                        const newDC = [...degreeClasses];
                                        newDC[index].degreeId = e.value;
                                        setDegreeClasses(newDC);
                                    }}
                                    placeholder="Série"
                                    ref={(el) => {dropdownRefs.current[`degree-${index}`] = el}}
                                    data-testid="degree-dropdown"
                                />
                            </Campo>

                            <Campo>
                                <label>Classes</label>
                                <MultiSelect
                                    value={dc.classIds ?? ''}
                                    options={classes.map((c, idx) => ({ label: c.name, value: idx + 1 }))}
                                    onChange={(e) => {
                                        const newDC = [...degreeClasses];
                                        newDC[index].classIds = e.value;
                                        setDegreeClasses(newDC);
                                    }}
                                    placeholder="Selecione as Classes"
                                    display="chip"
                                    ref={(el) => {dropdownRefs.current[`class-${index}`] = el}}
                                    data-testid="class-multiselect"
                                />
                            </Campo>
                        </DegreeGrid>
                    </DegreeBlock>
                ))}

                <ButtonGroup>
                    <Button label="Adicionar Série" icon="pi pi-plus" onClick={handleAddDegree} className="p-button-secondary" />
                    <Button label="Salvar" icon="pi pi-check" onClick={handleSave} className="p-button-primary" />
                </ButtonGroup>
            </FormWrapper>

            <Dialog
                header="Erro"
                visible={showError}
                onHide={() => setShowError(false)}
                style={{ width: '400px' }}
                modal
                data-testid="error-message"
            >
                <p>Todos os campos são obrigatórios. É necessário selecionar pelo menos uma série e uma classe.</p>
            </Dialog>
        </>
    );
};

export default NovoRelacionamentoForm;
