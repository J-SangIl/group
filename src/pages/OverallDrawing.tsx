import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { Student } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import BackButton from '../components/BackButton';

export default function OverallDrawing() {
  const { className } = useParams<{ className: string }>();
  const { getAvailableStudentsInClass } = useStudentContext();
  const availableStudents = getAvailableStudentsInClass(className || '');

  const [drawnStudent, setDrawnStudent] = useState<Student | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const drawStudent = () => {
    if (availableStudents.length === 0) return;

    setIsDrawing(true);
    setDrawnStudent(null);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      setDrawnStudent(availableStudents[randomIndex]);
      setIsDrawing(false);
    }, 500); // Short animation delay
  };

  if (!className) {
    return <div className="text-red-500">반 이름이 지정되지 않았습니다.</div>;
  }

  return (
    <div className="card-container relative">
      <BackButton />
      <h1 className="title-text">{className} 전체 학생 뽑기</h1>
      <p className="subtitle-text">총 인원: {availableStudents.length}명 (결석생 제외)</p>

      <button
        onClick={drawStudent}
        disabled={isDrawing || availableStudents.length === 0}
        className="w-full btn-accent disabled:opacity-50"
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
            className="mt-6 p-4 bg-yellow-100 border-2 border-yellow-300 text-yellow-800 rounded-xl text-center text-2xl font-bold shadow-lg"
          >
            뽑힌 학생: {drawnStudent.name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
