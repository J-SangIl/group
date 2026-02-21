import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useStudentContext } from '../context/StudentContext';
import { ClassData, Student } from '../types';
import { useNavigate } from 'react-router-dom';

export default function ClassSelection() {
  const { loadClassData, classData } = useStudentContext();
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const newClassData: ClassData = {};

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const json: { 번호: number; 이름: string }[] = XLSX.utils.sheet_to_json(worksheet);
          newClassData[sheetName] = json.map(row => ({
            id: row.번호,
            name: row.이름,
            absent: false,
          }));
        });
        loadClassData(newClassData);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClassSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const enterClass = () => {
    if (selectedClass) {
      navigate(`/class/${selectedClass}`);
    }
  };

  return (
    <div className="card-container">
      <h1 className="title-text">학교 뽑기 앱</h1>
      <p className="subtitle-text">학생 명단을 업로드하고 반을 선택하세요!</p>

      <div className="space-y-4">
        <label htmlFor="excel-upload" className="block text-base font-medium text-gray-700">학생 명단 엑셀 업로드</label>
        <input
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="input-field file:bg-[#E0E0D8] file:text-[#5A5A40] file:font-semibold file:py-2 file:px-4 file:rounded-full file:border-0 file:text-base file:cursor-pointer hover:file:bg-[#D0D0C8]"
        />
      </div>

      <div className="space-y-4">
        <label htmlFor="class-select" className="block text-base font-medium text-gray-700">수업 반 선택</label>
        <select
          id="class-select"
          value={selectedClass}
          onChange={handleClassSelect}
          className="input-field"
        >
          <option value="">반을 선택하세요</option>
          {Object.keys(classData).map(className => (
            <option key={className} value={className}>
              {className}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={enterClass}
        disabled={!selectedClass}
        className="w-full btn-primary disabled:opacity-50"
      >
        선택한 반으로 입장
      </button>
    </div>
  );
}
