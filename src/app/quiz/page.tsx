"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Button, Card, Loading } from "@/components/ui";
import { useProject } from "@/hooks/useProject";
import { BookOpen, CheckCircle2, Clock, HelpCircle, Play, Trophy } from "lucide-react";
import { Suspense, useState } from "react";

// Mock Data
const MOCK_NOTEBOOKS = [
  { id: '1', title: 'Kiến thức React cơ bản', topic: 'Frontend', questionCount: 15, duration: '15 phút' },
  { id: '2', title: 'Từ vựng IELTS chủ đề Environment', topic: 'English', questionCount: 20, duration: '20 phút' },
  { id: '3', title: 'Lịch sử Việt Nam thế kỷ 20', topic: 'History', questionCount: 10, duration: '10 phút' },
];

const MOCK_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "React Hook nào được sử dụng để quản lý state trong functional component?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctAnswer: 1 // Index
  },
  {
    id: 2,
    question: "Hook nào chạy side-effects sau khi render?",
    options: ["useMemo", "useCallback", "useEffect", "useRef"],
    correctAnswer: 2
  }
];

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <Loading size="lg" text="Đang tải Quiz..." />
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}

function QuizPageContent() {
  const { project } = useProject();
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // Mock Quiz Flow
  if (isPlaying) {
    if (showResult) {
      return (
        <MainLayout headerTitle="Kết quả trắc nghiệm" headerSubtitle="Kết quả bài kiểm tra của bạn">
           <div className="max-w-2xl mx-auto p-6">
              <Card className="text-center py-12 px-6 space-y-6">
                 <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                 </div>
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Hoàn thành!</h2>
                    <p className="text-gray-500 mt-2">Bạn đã trả lời đúng {score}/{MOCK_QUIZ_QUESTIONS.length} câu hỏi</p>
                 </div>
                 <div className="text-4xl font-extrabold text-blue-600">
                    {Math.round((score / MOCK_QUIZ_QUESTIONS.length) * 100)}%
                 </div>
                 <Button onClick={() => { setIsPlaying(false); setShowResult(false); setCurrentQuestion(0); setScore(0); }}>
                    Quay lại danh sách
                 </Button>
              </Card>
           </div>
        </MainLayout>
      );
    }

    const question = MOCK_QUIZ_QUESTIONS[currentQuestion];

    return (
      <MainLayout headerTitle="Đang làm bài..." headerSubtitle={`Câu hỏi ${currentQuestion + 1}/${MOCK_QUIZ_QUESTIONS.length}`}>
        <div className="max-w-3xl mx-auto p-6">
           <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium text-gray-500">Thời gian còn lại: 14:32</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500" style={{ width: `${((currentQuestion + 1) / MOCK_QUIZ_QUESTIONS.length) * 100}%` }}></div>
              </div>
           </div>

           <Card className="p-8 mb-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">{question.question}</h3>
              <div className="space-y-3">
                 {question.options.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-500 transition-all flex items-center gap-3 group"
                      onClick={() => {
                        if (index === question.correctAnswer) setScore(s => s + 1);
                        if (currentQuestion < MOCK_QUIZ_QUESTIONS.length - 1) {
                           setCurrentQuestion(c => c + 1);
                        } else {
                           setShowResult(true);
                        }
                      }}
                    >
                       <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm font-medium text-gray-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                          {String.fromCharCode(65 + index)}
                       </div>
                       <span className="text-gray-700 dark:text-gray-200">{option}</span>
                    </button>
                 ))}
              </div>
           </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      headerTitle="Trắc nghiệm & Ôn tập"
      headerSubtitle="Tạo bài kiểm tra từ nội dung sổ tay của bạn"
    >
      <div className="p-6 max-w-5xl mx-auto space-y-8">
         {/* Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800">
               <div className="p-3 bg-blue-500/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
               </div>
               <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">12</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sổ tay đã tạo</div>
               </div>
            </Card>
            <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
               <div className="p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
               </div>
               <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">85%</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tỷ lệ đúng trung bình</div>
               </div>
            </Card>
            <Card className="p-6 flex items-center gap-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-100 dark:border-purple-800">
               <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
               </div>
               <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">5</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Bài thi tuần này</div>
               </div>
            </Card>
         </div>

         {/* Available Notebooks */}
         <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
               <Play className="w-5 h-5 text-blue-500" />
               Bắt đầu bài kiểm tra mới
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {MOCK_NOTEBOOKS.map((notebook) => (
                  <Card key={notebook.id} className="group hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-blue-500 cursor-pointer" onClick={() => setSelectedNotebook(notebook.id)}>
                     <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                           <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                              {notebook.topic}
                           </span>
                           <HelpCircle className="w-5 h-5 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors">
                           {notebook.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                           <span className="flex items-center gap-1">
                              <HelpCircle className="w-4 h-4" /> {notebook.questionCount} câu
                           </span>
                           <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {notebook.duration}
                           </span>
                        </div>
                        <Button className="w-full mt-2" variant="secondary" onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}>
                           Làm bài ngay
                        </Button>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
         
      </div>
    </MainLayout>
  );
}
