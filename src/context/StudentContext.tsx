import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { ClassData, Student } from '../types';

interface Group {
  groupNumber: number;
  students: Student[];
}

interface StudentContextType {
  classData: ClassData;
  loadClassData: (data: ClassData) => void;
  updateStudentAbsence: (className: string, studentId: number, absent: boolean) => void;
  getStudentsInClass: (className: string) => Student[];
  getAvailableStudentsInClass: (className: string) => Student[];
  groupedStudents: { [className: string]: Group[] };
  setGroupedStudents: (className: string, groups: Group[]) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [classData, setClassData] = useState<ClassData>({});
  const [groupedStudents, setGroupedStudentsState] = useState<{ [className: string]: Group[] }>({});

  const loadClassData = useCallback((data: ClassData) => {
    setClassData(prevData => ({
      ...prevData,
      ...data,
    }));
  }, []);

  const updateStudentAbsence = useCallback((className: string, studentId: number, absent: boolean) => {
    setClassData(prevData => {
      const updatedClass = prevData[className]?.map(student =>
        student.id === studentId ? { ...student, absent } : student
      );
      return {
        ...prevData,
        [className]: updatedClass,
      };
    });
  }, []);

  const getStudentsInClass = useCallback((className: string) => {
    return classData[className] || [];
  }, [classData]);

  const getAvailableStudentsInClass = useCallback((className: string) => {
    return (classData[className] || []).filter(student => !student.absent);
  }, [classData]);

  const setGroupedStudents = useCallback((className: string, groups: Group[]) => {
    setGroupedStudentsState(prev => ({ ...prev, [className]: groups }));
  }, []);

  return (
    <StudentContext.Provider value={{
      classData,
      loadClassData,
      updateStudentAbsence,
      getStudentsInClass,
      getAvailableStudentsInClass,
      groupedStudents,
      setGroupedStudents,
    }}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};
