import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import { Student } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import BackButton from '../components/BackButton';

export default function GroupDrawing() {
  const { className } = useParams<{ className: string }>();
  const navigate = useNavigate();
  const { getAvailableStudentsInClass, setGroupedStudents, groupedStudents } = useStudentContext();
  const availableStudents = getAvailableStudentsInClass(className || '');

interface Group {
  groupNumber: number;
  students: Student[];
}

  const [searchParams] = useSearchParams();
  const initialNumGroups = Number(searchParams.get('numGroups')) || 2;
  const [numGroups, setNumGroups] = useState<number>(initialNumGroups);
  const [groups, setGroups] = useState<Group[]>(groupedStudents[className || ''] || []);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  useEffect(() => {
    if (availableStudents.length > 0 && groups.length === 0) {
      // Only draw if no groups are already set for this class
      drawGroups();
    }
  }, [availableStudents.length]); // Initial draw when students load

  useEffect(() => {
    // Update numGroups if URL param changes
    setNumGroups(initialNumGroups);
  }, [initialNumGroups]);

  const shuffleArray = (array: Student[]) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  const drawGroups = () => {
    if (!className || availableStudents.length === 0) return;

    setIsDrawing(true);
    setTimeout(() => {
      const shuffledStudents = shuffleArray([...availableStudents]);
      const newGroups: Group[] = Array.from({ length: numGroups }, (_, i) => ({ groupNumber: i + 1, students: [] }));

      shuffledStudents.forEach((student, index) => {
        newGroups[index % numGroups].students.push(student);
      });
      setGroups(newGroups);
      setGroupedStudents(className, newGroups); // Save to context
      setIsDrawing(false);
    }, 500); // Short animation delay
  };

  if (!className) {
    return <div className="text-red-500">반 이름이 지정되지 않았습니다.</div>;
  }

  return (
    <div className="card-container relative max-w-4xl">
      <BackButton />
      <h1 className="title-text">{className} 모둠 뽑기</h1>
      <p className="subtitle-text">총 인원: {availableStudents.length}명 (결석생 제외)</p>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <label htmlFor="num-groups" className="text-lg font-medium text-gray-700">모둠 개수:</label>
        <input
          id="num-groups"
          type="number"
          min="1"
          max={availableStudents.length}
          value={numGroups}
          onChange={(e) => setNumGroups(Math.max(1, Math.min(availableStudents.length, Number(e.target.value))))}
          className="input-field w-24 text-center"
          disabled // numGroups is now controlled by GroupNumSelection
        />
        <button
          onClick={drawGroups}
          disabled={isDrawing || availableStudents.length === 0 || numGroups === 0}
          className="btn-primary disabled:opacity-50"
        >
          {isDrawing ? '뽑는 중...' : '다시 뽑기'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 p-4 border-4 border-black rounded-xl bg-gray-50">
        <AnimatePresence mode="wait">
          {groups.map((group) => (
            <motion.div
              key={group.groupNumber}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: group.groupNumber * 0.1 }}
              className="bg-blue-100 p-4 rounded-xl shadow-md border-2 border-blue-300"
            >
              <h2 className="text-2xl font-bold text-blue-800 mb-3">{group.groupNumber} 모둠 ({group.students.length}명)</h2>
              <ul className="list-disc list-inside space-y-1 text-blue-900">
                {group.students.map(student => (
                  <li key={student.id}>{student.name}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(`/class/${className}/single-drawing`)}
          className="btn-secondary"
        >
          이 모둠으로 모둠 내 뽑기
        </button>
      </div>
    </div>
  );
}
