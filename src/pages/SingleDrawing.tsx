import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { Student } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import BackButton from '../components/BackButton';

export default function SingleDrawing() {
  const { className } = useParams<{ className: string }>();
  const { getAvailableStudentsInClass, groupedStudents } = useStudentContext();
  const availableStudents = getAvailableStudentsInClass(className || '');
  const currentClassGroups = groupedStudents[className || ''] || [];

  const [selectedGroupNumber, setSelectedGroupNumber] = useState<number | ''>('');
  const [drawnStudent, setDrawnStudent] = useState<Student | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const studentsInSelectedGroup = useMemo(() => {
    if (selectedGroupNumber === '') return [];
    const group = currentClassGroups.find(g => g.groupNumber === selectedGroupNumber);
    return group ? group.students : [];
  }, [selectedGroupNumber, currentClassGroups]);

  const drawStudentFromGroup = () => {
    if (selectedGroupNumber === '' || studentsInSelectedGroup.length === 0) return;

    setIsDrawing(true);
    setDrawnStudent(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * studentsInSelectedGroup.length);
      setDrawnStudent(studentsInSelectedGroup[randomIndex]);
      setIsDrawing(false);
    }, 500); // Short animation delay
  };

  if (!className) {
    return <div className="text-red-500">반 이름이 지정되지 않았습니다.</div>;
  }

  const hasGroups = currentClassGroups.length > 0;

  return (
    <div className="card-container relative">
      <BackButton />
      <h1 className="title-text">{className} 모둠 내 뽑기</h1>
      <p className="subtitle-text">총 인원: {availableStudents.length}명 (결석생 제외)</p>

      {!hasGroups && (
        <p className="text-center text-red-500 mb-4">먼저 모둠 뽑기를 진행해주세요!</p>
      )}

      <div className="space-y-4">
        <label htmlFor="group-select" className="block text-base font-medium text-gray-700">모둠 선택</label>
        <select
          id="group-select"
          value={selectedGroupNumber}
          onChange={(e) => setSelectedGroupNumber(Number(e.target.value))}
          className="input-field"
          disabled={!hasGroups}
        >
          <option value="">모둠을 선택하세요</option>
          {currentClassGroups.map(group => (
            <option key={group.groupNumber} value={group.groupNumber}>
              {group.groupNumber} 모둠 ({group.students.length}명)
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={drawStudentFromGroup}
        disabled={isDrawing || selectedGroupNumber === '' || studentsInSelectedGroup.length === 0}
        className="w-full btn-secondary disabled:opacity-50"
      >
        {isDrawing ? '뽑는 중...' : '학생 뽑기'}
      </button>

      <AnimatePresence>
        {drawnStudent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 bg-purple-100 border-4 border-purple-400 text-purple-800 rounded-xl text-center text-2xl font-bold shadow-lg"
          >
            뽑힌 학생: {drawnStudent.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
