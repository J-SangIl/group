import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { Student } from '../types';
import BackButton from '../components/BackButton';

export default function StudentManagement() {
  const { className } = useParams<{ className: string }>();
  const navigate = useNavigate();
  const { getStudentsInClass, updateStudentAbsence } = useStudentContext();
  const students = getStudentsInClass(className || '');

  const handleAbsenceToggle = (studentId: number) => {
    const student = students.find(s => s.id === studentId);
    if (student && className) {
      updateStudentAbsence(className, studentId, !student.absent);
    }
  };

  if (!className) {
    return <div className="text-red-500">반 이름이 지정되지 않았습니다.</div>;
  }

  return (
    <div className="card-container relative max-w-2xl">
      <BackButton to="/" />
      <h1 className="title-text">{className} 학생 명단</h1>
      <p className="subtitle-text">결석한 학생을 선택하여 뽑기 명단에서 제외할 수 있습니다.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
        {students.map((student: Student) => (
          <div
            key={student.id}
            onClick={() => handleAbsenceToggle(student.id)}
            className={`student-card ${student.absent ? 'student-card-absent' : 'student-card-present'}`}
          >
            <span className="font-bold">{student.id}.</span> {student.name}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-around mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => navigate(`/class/${className}/group-num-selection`)}
          className="btn-primary"
        >
          모둠 뽑기
        </button>
        <button
          onClick={() => navigate(`/class/${className}/single-drawing`)}
          className="btn-secondary"
        >
          모둠 내 뽑기
        </button>
        <button
          onClick={() => navigate(`/class/${className}/overall-drawing`)}
          className="btn-accent"
        >
          전체 학생 뽑기
        </button>
      </div>
    </div>
  );
}
