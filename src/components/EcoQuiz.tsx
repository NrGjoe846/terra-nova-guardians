import { useState, useCallback } from "react";
import { ElementalCard } from "@/components/ui/ElementalCard";
import { ElementalButton } from "@/components/ui/ElementalButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: "energy" | "wildlife" | "recycling" | "climate";
}

interface EcoQuizProps {
  onQuizComplete: (score: number) => void;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: "1",
    question: "Which of these actions saves the most energy at home?",
    options: [
      "Turning off lights when leaving a room",
      "Using LED bulbs instead of incandescent",
      "Unplugging electronics when not in use", 
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these actions help save energy! LED bulbs use 75% less energy, and phantom loads from unplugged devices can account for 10% of home energy use.",
    category: "energy"
  },
  {
    id: "2", 
    question: "How long does it take for a plastic bottle to decompose in nature?",
    options: ["50 years", "100 years", "450 years", "1000 years"],
    correctAnswer: 2,
    explanation: "Plastic bottles can take up to 450 years to decompose! That's why recycling and reducing plastic use is so important.",
    category: "recycling"
  },
  {
    id: "3",
    question: "What percentage of Earth's water is fresh water available for human use?",
    options: ["30%", "10%", "3%", "Less than 1%"],
    correctAnswer: 3,
    explanation: "Less than 1% of Earth's water is fresh water available for human use. Most water is in oceans or ice caps, making conservation crucial!",
    category: "climate"
  },
  {
    id: "4",
    question: "Which animal is considered a 'keystone species' in many ecosystems?",
    options: ["Lions", "Bees", "Elephants", "All of the above"],
    correctAnswer: 3,
    explanation: "All of these are keystone species! They play crucial roles in their ecosystems - bees pollinate plants, elephants shape landscapes, and lions control prey populations.",
    category: "wildlife"
  }
];

export const EcoQuiz = ({ onQuizComplete }: EcoQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === quizQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    
    setShowExplanation(true);
  }, [currentQuestion, showExplanation]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion + 1 >= quizQuestions.length) {
      onQuizComplete(score);
      return;
    }
    
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentQuestion, score, onQuizComplete]);

  const startQuiz = useCallback(() => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const resetQuiz = useCallback(() => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const question = quizQuestions[currentQuestion];

  if (!quizStarted) {
    return (
      <ElementalCard className="p-6 text-center space-y-4">
        <div className="space-y-2">
          <Brain className="mx-auto text-primary" size={48} />
          <h2 className="text-2xl font-bold text-primary">🌍 Eco Knowledge Quiz</h2>
          <p className="text-muted-foreground">
            Test your environmental knowledge and help restore Terra Nova!
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {quizQuestions.length} questions • 10 points each
          </p>
          <ElementalButton element="sky" onClick={startQuiz} className="w-full">
            Start Quiz
          </ElementalButton>
        </div>
      </ElementalCard>
    );
  }

  return (
    <ElementalCard className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Badge variant="secondary">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Badge>
          <Badge variant="outline">
            Score: {score}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="capitalize">
            {question.category}
          </Badge>
          <h3 className="text-lg font-semibold leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let variant: "outline" | "default" = "outline";
            let icon = null;
            
            if (showExplanation) {
              if (index === question.correctAnswer) {
                variant = "default";
                icon = <CheckCircle className="text-green-500" size={20} />;
              } else if (index === selectedAnswer && index !== question.correctAnswer) {
                icon = <XCircle className="text-red-500" size={20} />;
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
                  selectedAnswer === index 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-card'
                } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {icon}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-muted/50 rounded-xl">
              <h4 className="font-semibold mb-2">
                {selectedAnswer === question.correctAnswer ? "Correct! 🎉" : "Not quite! 🤔"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </div>
            
            <ElementalButton 
              element="sky" 
              onClick={handleNextQuestion}
              className="w-full"
            >
              {currentQuestion + 1 >= quizQuestions.length ? "Complete Quiz" : "Next Question"}
            </ElementalButton>
          </div>
        )}
      </div>

      {/* Restart option */}
      <div className="text-center">
        <button 
          onClick={resetQuiz}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Restart Quiz
        </button>
      </div>
    </ElementalCard>
  );
};