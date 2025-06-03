import React, { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Student } from '../types';
import { useDataContext } from '../context/DataContext';
import styled from 'styled-components';

interface Props {
    aluno: Student;
    onHide: () => void;
    onSave: (updated: Student) => void;
}

const ModalWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-weight: 600;
    font-size: 14px;
  }

  .p-inputtext,
  .p-dropdown {
    width: 100%;
    height: 40px;
    font-size: 14px;
  }

  .p-dropdown {
    position: relative;
  }

  .p-dropdown-clear-icon {
    position: absolute;
    right: 2.5rem !important;
  }
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 0 24px 24px 24px;
`;

const Cancelar = styled(Button)`
  background: white;
  border: 1px solid #333;
  color: #333;
  padding: 10px 24px;
  font-weight: 600;
`;

const Salvar = styled(Button)`
  background: #2d8cff;
  border: none;
  color: white;
  padding: 10px 24px;
  font-weight: 600;
`;

const EditarAlunoModal: React.FC<Props> = ({ aluno, onHide, onSave }) => {
    const { degrees, classes } = useDataContext();
    const [nome, setNome] = useState(aluno.name);
    const [classeId, setClasseId] = useState(aluno.classId);
    const [degreeId, setDegreeId] = useState(aluno.degreeId);
    const [error, setError] = useState<string | null>(null);
    const dropdownRefs = useRef<Record<string, any>>({});

    const salvar = () => {
        if (!nome.trim() || !degreeId || !classeId) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        onSave({ ...aluno, name: nome.trim(), classId: classeId, degreeId });
    };

    const hideAllDropdowns = () => {
        event?.stopImmediatePropagation();
        Object.values(dropdownRefs.current).forEach((ref) => ref?.hide?.());
    };

    const handleShow = () => {
        document.querySelector('.p-dialog-content')?.addEventListener('scroll', hideAllDropdowns);
    };

    return (
        <Dialog
            header="Editar Aluno"
            visible
            onHide={onHide}
            modal
            onShow={handleShow}
            style={{ width: '400px' }}
            draggable={false}
            blockScroll
            footer={
                <FooterWrapper>
                    <Cancelar
                        label="Cancelar"
                        icon="pi pi-times"
                        onClick={onHide}
                    />
                    <Salvar
                        label="Salvar"
                        icon="pi pi-check"
                        onClick={salvar}
                        autoFocus
                    />
                </FooterWrapper>
            }
        >
            <ModalWrapper>
                <Campo>
                    <label htmlFor="nome">Nome</label>
                    <InputText
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Digite o nome"
                        data-testid="nome-input"
                    />
                </Campo>

                <Campo>
                    <label htmlFor="degree">Série</label>
                    <Dropdown
                        id="degree"
                        value={degreeId}
                        options={degrees.map((d) => ({ label: d.name, value: d.id }))}
                        onChange={(e) => setDegreeId(e.value)}
                        ref={(el) => { dropdownRefs.current[0] = el }}
                        placeholder="Selecione a Série"
                        showClear
                        filter
                        data-testid="degree-dropdown"
                    />
                </Campo>

                <Campo>
                    <label htmlFor="classe">Classe</label>
                    <Dropdown
                        id="classe"
                        value={classeId}
                        options={classes.map((c, index) => ({ label: c.name, value: index + 1 }))}
                        onChange={(e) => setClasseId(e.value)}
                        ref={(el) => { dropdownRefs.current[1] = el }}
                        placeholder="Selecione a Classe"
                        showClear
                        filter
                        data-testid="class-dropdown"
                    />
                </Campo>

                {error && <small style={{ color: 'red' }} data-testid="error-message">{error}</small>}
            </ModalWrapper>
        </Dialog>
    );
};

export default EditarAlunoModal;
