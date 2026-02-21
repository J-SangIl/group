import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudentContext } from '../context/StudentContext';
import BackButton from '../components/BackButton';

export default function GroupNumSelection() {
  const { className } = useParams<{ className: string }>();
  const navigate = useNavigate();
  const { getAvailableStudentsInClass } = useStudentContext();
  const availableStudents = getAvailableStudentsInClass(className || '');

  const [numGroups, setNumGroups] = useState<number>(2);

  const handleStartGroupDrawing = () => {
    if (className && numGroups > 0 && numGroups <= availableStudents.length) {
      navigate(`/class/${className}/group-drawing?numGroups=${numGroups}`);
    }
  };

  if (!className) {
    return <div className="text-red-500">반 이름이 지정되지 않았습니다.</div>;
  }

  return (
    <div className="card-container relative">
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
        />
        <button
          onClick={handleStartGroupDrawing}
          disabled={numGroups === 0 || availableStudents.length === 0 || numGroups > availableStudents.length}
          className="btn-primary disabled:opacity-50"
        >
          모둠 뽑기 시작
        </button>
      </div>
    </div>
  );
}
