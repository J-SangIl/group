/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClassSelection from './pages/ClassSelection';
import StudentManagement from './pages/StudentManagement';
import GroupNumSelection from './pages/GroupNumSelection';
import GroupDrawing from './pages/GroupDrawing';
import SingleDrawing from './pages/SingleDrawing';
import OverallDrawing from './pages/OverallDrawing';
import { StudentProvider } from './context/StudentContext';

export default function App() {
  return (
    <Router>
      <StudentProvider>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
          <Routes>
            <Route path="/" element={<ClassSelection />} />
            <Route path="/class/:className" element={<StudentManagement />} />
            <Route path="/class/:className/group-num-selection" element={<GroupNumSelection />} />
            <Route path="/class/:className/group-drawing" element={<GroupDrawing />} />
            <Route path="/class/:className/single-drawing" element={<SingleDrawing />} />
            <Route path="/class/:className/overall-drawing" element={<OverallDrawing />} />
          </Routes>
        </div>
      </StudentProvider>
    </Router>
  );
}
