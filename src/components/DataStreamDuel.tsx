import { useState, useCallback } from "react";
import { BioSynthCard } from "@/components/BioSynthCard";
import { BioSynthButton } from "@/components/ui/BioSynthButton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Database, CheckCircle, XCircle, Zap } from "lucide-react";

interface DataQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: "bio-systems" | "contamination" | "energy-flow" | "ecosystem-data";
}

interface DataStreamDuelProps {
  onQuizComplete: (score: number) => void;
}

const dataQuestions: DataQuestion[] = [
  {
    id: "1",
    question: "Which bio-synthetic process most efficiently converts solar energy into system power?",
    options: [
      "Photovoltaic cell arrays",
      "Bio-luminescent energy capture",
      "Hybrid organic-synthetic photosynthesis", 
      "All integrated systems combined"
    ],
    correctAnswer: 3,
    explanation: "Integrated bio-synthetic systems achieve 95% efficiency by combining organic processes with synthetic enhancement matrices.",
    category: "bio-systems"
  },
  {
    id: "2", 
    question: "How long does digital contamination persist in bio-synthetic memory cores?",
    options: ["50 processing cycles", "100 cycles", "450 cycles", "Indefinitely without purging"],
    correctAnswer: 3,
    explanation: "Digital contamination creates persistent data corruption that requires active decontamination protocols to eliminate.",
    category: "contamination"
  },
  {
    id: "3",
    question: "What percentage of Terra Nova's energy grid is powered by renewable bio-synthesis?",
    options: ["30%", "60%", "85%", "99.7%"],
    correctAnswer: 3,
    explanation: "Terra Nova's advanced bio-synthetic infrastructure achieves near-complete renewable energy integration through organic-digital fusion.",
    category: "energy-flow"
  },
  {
    id: "4",
    question: "Which system component is most critical for maintaining ecosystem data integrity?",
    options: ["Bio-sensors", "Neural networks", "Quantum processors", "All components working in harmony"],
    correctAnswer: 3,
    explanation: "Ecosystem stability requires seamless integration of biological monitoring, AI processing, and quantum computation systems.",
    category: "ecosystem-data"
  }
];

export const DataStreamDuel = ({ onQuizComplete }: DataStreamDuelProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [duelStarted, setDuelStarted] = useState(false);

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (showExplanation) return;
    
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === dataQuestions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 15);
    }
    
    setShowExplanation(true);
  }, [currentQuestion, showExplanation]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion + 1 >= dataQuestions.length) {
      // Update global tracking data
      const globalData = {
        gameType: "datastream",
        points: score,
        questionsAnswered: dataQuestions.length,
        playerId: "current-player"
      };
      
      // In a real implementation, this would send data to a backend service
      console.log("Global tracking data:", globalData);
      
      onQuizComplete(score);
      return;
    }
    
    setCurrentQuestion(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentQuestion, score, onQuizComplete]);

  const startDuel = useCallback(() => {
    setDuelStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const resetDuel = useCallback(() => {
    setDuelStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  const progress = ((currentQuestion + 1) / dataQuestions.length) * 100;
  const question = dataQuestions[currentQuestion];

  if (!duelStarted) {
    return (
      <BioSynthCard className="p-6 text-center space-y-4 hud-panel">
        <div className="space-y-2">
          <Database className="mx-auto text-primary animate-energy-pulse" size={48} />
          <h2 className="text-2xl font-bold text-primary bio-synth-title">💾 Data Stream Duel</h2>
          <p className="text-muted-foreground">
            Process environmental data streams and prove your system knowledge!
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground holo-text">
            {dataQuestions.length} data packets • 15 Bio-Credits each
          </p>
          <BioSynthButton variant="aether" onClick={startDuel} className="w-full">
            Initialize Data Stream
          </BioSynthButton>
        </div>
      </BioSynthCard>
    );
  }

  return (
    <BioSynthCard className="p-6 space-y-6 hud-panel">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="hud-panel">
            Data Packet {currentQuestion + 1} of {dataQuestions.length}
          </Badge>
          <Badge variant="outline" className="hud-panel">
            Score: {score}
          </Badge>
        </div>
        <Progress value={progress} className="h-2 border border-primary/30" />
      </div>

      {/* Question */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <Badge variant="outline" className="capitalize hud-panel data-stream">
            {question.category.replace('-', ' ')}
          </Badge>
          <h3 className="text-lg font-semibold leading-relaxed holo-text">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            let variant: "outline" | "default" = "outline";
            let icon = null;
            let glowClass = "";
            
            if (showExplanation) {
              if (index === question.correctAnswer) {
                variant = "default";
                icon = <CheckCircle className="text-green-500" size={20} />;
                glowClass = "border-green-500 bg-green-500/10";
              } else if (index === selectedAnswer && index !== question.correctAnswer) {
                icon = <XCircle className="text-red-500" size={20} />;
                glowClass = "border-red-500 bg-red-500/10";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={cn(
                  "w-full p-4 text-left rounded-xl border transition-all duration-200 hud-panel",
                  selectedAnswer === index 
                    ? 'border-primary bg-primary/10 neon-glow' 
                    : 'border-border hover:border-primary/50 hover:bg-card',
                  showExplanation ? 'cursor-default' : 'cursor-pointer',
                  glowClass
                )}
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
          <div className="space-y-4 animate-system-boot">
            <div className="p-4 bg-muted/50 rounded-xl hud-panel">
              <h4 className="font-semibold mb-2 holo-text">
                {selectedAnswer === question.correctAnswer ? "Data Stream Processed! ⚡" : "Processing Error! 🔧"}
              </h4>
              <p className="text-sm text-muted-foreground">
                {question.explanation}
              </p>
            </div>
            
            <BioSynthButton 
              variant="aether" 
              onClick={handleNextQuestion}
              className="w-full"
            >
              {currentQuestion + 1 >= dataQuestions.length ? "Complete Data Stream" : "Process Next Packet"}
            </BioSynthButton>
          </div>
        )}
      </div>

      {/* Restart option */}
      <div className="text-center">
        <button 
          onClick={resetDuel}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors holo-text"
        >
          Reinitialize Data Stream
        </button>
      </div>
    </BioSynthCard>
  );
};
