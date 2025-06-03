
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { DataProvider, useDataContext } from '../context/DataContext';
import { Relationship } from '../types';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <DataProvider>{children}</DataProvider>
);

describe('DataContext', () => {
  it('deve expor os dados iniciais corretamente', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    expect(result.current.students.length).toBeGreaterThan(0);
    expect(result.current.degrees.length).toBeGreaterThan(0);
    expect(result.current.classes.length).toBeGreaterThan(0);
    expect(result.current.teachers.length).toBeGreaterThan(0);
    expect(result.current.matters.length).toBeGreaterThan(0);
    expect(result.current.relationships.length).toBeGreaterThan(0);
  });

  it('deve retornar todos os alunos se nenhum filtro for aplicado', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const all = result.current.getFilteredStudents();
    expect(all.length).toBe(result.current.students.length);
  });

  it('deve filtrar alunos por degreeId', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const filtered = result.current.getFilteredStudents(1);
    expect(filtered.every(a => a.degreeId === 1)).toBeTruthy();
  });

  it('deve filtrar alunos por classId', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const filtered = result.current.getFilteredStudents(undefined, 1);
    expect(filtered.every(a => a.classId === 1)).toBeTruthy();
  });

  it('deve filtrar alunos por degreeId e classId', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const filtered = result.current.getFilteredStudents(1, 1);
    expect(filtered.every(a => a.degreeId === 1 && a.classId === 1)).toBeTruthy();
  });

  it('deve atualizar um aluno corretamente', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const student = result.current.students[0];
    act(() => {
      result.current.updateStudent({ ...student, name: 'Atualizado' });
    });
    expect(result.current.students.find(s => s.id === student.id)?.name).toBe('Atualizado');
  });

  it('deve gerar 300 alunos com RA únicos', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const initialLength = result.current.students.length;
    act(() => {
      result.current.generateStudents();
    });
    const newLength = result.current.students.length;
    expect(newLength - initialLength).toBe(300);

    const ras = new Set(result.current.students.map(s => s.ra));
    expect(ras.size).toBe(result.current.students.length);
  });

  it('deve adicionar um novo relacionamento', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const newRel: Relationship = {
      id: 999,
      teacherId: 1,
      matterId: 1,
      degrees: [],
    };
    act(() => {
      result.current.addRelationship(newRel);
    });
    expect(result.current.relationships.find(r => r.id === 999)).toBeTruthy();
  });

  it('deve atualizar um relacionamento existente', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const oldRel = result.current.relationships[0];
    act(() => {
      result.current.updateRelationship({ ...oldRel, teacherId: 999 });
    });
    expect(result.current.relationships.find(r => r.id === oldRel.id)?.teacherId).toBe(999);
  });

  it('deve obter relacionamento por ID', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const rel = result.current.relationships[0];
    expect(result.current.getRelationshipById(rel.id)).toEqual(rel);
  });

  it('deve retornar undefined para ID inexistente', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    expect(result.current.getRelationshipById(-1)).toBeUndefined();
  });

  it('deve deletar relacionamento por ID', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const rel = result.current.relationships[0];
    act(() => {
      result.current.deleteRelationship(rel.id);
    });
    expect(result.current.relationships.find(r => r.id === rel.id)).toBeUndefined();
  });

  it('deve deletar aluno por ID', () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });
    const aluno = result.current.students[0];
    act(() => {
      result.current.deleteStudent(aluno.id);
    });
    expect(result.current.students.find(a => a.id === aluno.id)).toBeUndefined();
  });
});
