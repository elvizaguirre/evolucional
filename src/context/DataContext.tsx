import React, { createContext, useContext, useEffect, useState } from 'react';
import studentsData from '../data/students.json';
import degreesData from '../data/degrees.json';
import teachersData from '../data/teachers.json';
import mattersData from '../data/matters.json';
import relationshipsData from '../data/relationships.json';
import classesJson from '../data/classes.json';
import { Degree, Class, Student, Teacher, Matter, Relationship } from '../types';

export interface DataContextProps {
    students: Student[];
    degrees: Degree[];
    classes: Class[];
    teachers: Teacher[];
    matters: Matter[];
    relationships: Relationship[];
    getFilteredStudents: (degreeId?: number, classId?: number) => Student[];
    updateStudent: (updated: Student) => void;
    generateStudents: () => void;
    addRelationship: (rel: Relationship) => void;
    updateRelationship: (rel: Relationship) => void;
    getRelationshipById: (id: number) => Relationship | undefined;
    deleteRelationship: (id: number) => void;
    deleteStudent: (id: number) => void;
}

export const DataContext = createContext<DataContextProps>({} as DataContextProps);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>(studentsData);
    const [degrees] = useState<Degree[]>(degreesData);
    const [classes] = useState<Class[]>(classesJson.classes);
    const [teachers] = useState<Teacher[]>(teachersData);
    const [matters] = useState<Matter[]>(mattersData);
    const [relationships, setRelationships] = useState<Relationship[]>(relationshipsData);

    const getFilteredStudents = (degreeId?: number, classId?: number) => {
        return students.filter((s) => {
            const matchDegree = degreeId === undefined || s.degreeId === degreeId;
            const matchClass = classId === undefined || s.classId === classId;
            return matchDegree && matchClass;
        });
    };

    const updateStudent = (updated: Student) => {
        setStudents((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s))
        );
    };

    const addRelationship = (newRel: Relationship) => {
        setRelationships((prev) => [...prev, newRel]);
    };

    const updateRelationship = (updated: Relationship) => {
        setRelationships((prev) =>
            prev.map((r) => (r.id === updated.id ? updated : r))
        );
    };

    const getRelationshipById = (id: number): Relationship | undefined => {
        return relationships.find(r => r.id === id);
    };

    const deleteRelationship = (id: number) => {
        setRelationships((prev) => prev.filter((r) => r.id !== id));
    };

    const deleteStudent = (id: number) => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
    };

    const generateStudents = () => {
        const newStudents: Student[] = [];
        const usedRas = new Set<number>();

        const getRandomRa = (): number => {
            let ra;
            do {
                ra = Math.floor(100000 + Math.random() * 900000);
            } while (usedRas.has(ra));
            usedRas.add(ra);
            return ra;
        };

        for (let i = 0; i < 300; i++) {
            const degree = degrees[Math.floor(Math.random() * degrees.length)];
            const classIndex = Math.floor(Math.random() * classes.length);
            const newStudent: Student = {
                id: students.length + i + 1,
                name: `Aluno Gerado ${students.length + i + 1}`,
                ra: getRandomRa(),
                degreeId: degree.id,
                classId: classIndex + 1,
            };
            newStudents.push(newStudent);
        }

        setStudents((prev) => [...prev, ...newStudents]);
    };

    return (
        <DataContext.Provider
            value={{
                students,
                degrees,
                classes,
                teachers,
                matters,
                relationships,
                getFilteredStudents,
                updateStudent,
                generateStudents,
                addRelationship,
                updateRelationship,
                getRelationshipById,
                deleteRelationship,
                deleteStudent,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => useContext(DataContext);
