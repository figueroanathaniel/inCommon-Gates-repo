import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router";
import Gate from "./pages/Gate";
import Hall from "./pages/Hall";
import Glossary from "./pages/Glossary";
import LessonPage from "./pages/LessonPage";
import Stone from "./pages/Stone";
import Desk from "./pages/Desk";
import Register from "./pages/Register";
import Teacher from "./pages/Teacher";
import NotFound from "./pages/NotFound";

// The road is three.js, so it is fetched only when the garden is entered.
const Journey = lazy(() => import("./pages/Journey"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Gate />} />
      <Route path="/hall" element={<Hall />} />
      <Route path="/glossary" element={<Glossary />} />
      <Route path="/scroll/:lessonId" element={<LessonPage />} />
      <Route path="/stone" element={<Stone />} />
      <Route path="/desk" element={<Desk />} />
      <Route path="/register" element={<Register />} />
      <Route path="/teacher" element={<Teacher />} />
      <Route path="/journey" element={<Suspense fallback={null}><Journey /></Suspense>} />
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
