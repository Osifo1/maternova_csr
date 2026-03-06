import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Trophy, Star, Play } from 'lucide-react';
import heroImage from '@/assets/quiz-hero.jpg';

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const questions = [
    {
      question: "What is the recommended amount of folic acid for pregnant women?",
      options: ["200 mcg daily", "400 mcg daily", "600 mcg daily", "800 mcg daily"],
      correct: 1,
      explanation: "The CDC recommends 400 mcg of folic acid daily to prevent neural tube defects."
    },
    {
      question: "When should prenatal vitamins ideally be started?",
      options: ["After confirming pregnancy", "During the second trimester", "At least 1 month before conception", "Only if recommended by doctor"],
      correct: 2,
      explanation: "Prenatal vitamins should be started at least 1 month before conception for optimal benefits."
    },
    {
      question: "What is considered a healthy weight gain during pregnancy for normal BMI?",
      options: ["15-20 lbs", "25-35 lbs", "40-45 lbs", "50+ lbs"],
      correct: 1,
      explanation: "For women with normal BMI (18.5-24.9), the recommended weight gain is 25-35 pounds."
    },
    {
      question: "How often should fetal movements be felt in the third trimester?",
      options: ["Once per day", "At least 10 movements in 2 hours", "5 movements per hour", "Only during meals"],
      correct: 1,
      explanation: "In the third trimester, you should feel at least 10 movements within 2 hours during your baby's active period."
    },
    {
      question: "What is the safest sleeping position during pregnancy?",
      options: ["On your back", "On your stomach", "On your left side", "Any position is fine"],
      correct: 2,
      explanation: "Sleeping on your left side improves blood flow to the baby and reduces pressure on major blood vessels."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return "Excellent! You're very knowledgeable about maternal health.";
    if (percentage >= 60) return "Good job! You have solid knowledge with room to grow.";
    if (percentage >= 40) return "Not bad! Consider reading more about maternal health.";
    return "Keep learning! Every step towards knowledge helps you stay healthy.";
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <img 
            src={heroImage} 
            alt="Mother and child learning together" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Maternal Health Quiz
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Test your knowledge about pregnancy, maternal health, and prenatal care. 
              Learn important facts while having fun!
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Quiz Challenge
              </CardTitle>
              <CardDescription>
                Answer {questions.length} questions about maternal health and earn points!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">~5</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    <Star className="w-6 h-6 mx-auto" />
                  </div>
                  <div className="text-sm text-muted-foreground">Earn Points</div>
                </div>
              </div>
              
              <div className="text-center">
                <Button onClick={startQuiz} size="lg" className="btn-medical-accent">
                  <Play className="w-4 h-4 mr-2" />
                  Start Quiz
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>
                  <strong>Note:</strong> Registered members earn points that can unlock special features.
                  Guests can play but won't accumulate points.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Quiz Completed!
            </h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Your Results</CardTitle>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {score} out of {questions.length} correct
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2">
                  {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-muted-foreground">{getScoreMessage()}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-border rounded-lg text-center">
                  <div className="text-lg font-semibold text-foreground mb-1">Points Earned</div>
                  <div className="text-2xl font-bold text-primary">{score * 10}</div>
                  <div className="text-sm text-muted-foreground">
                    {score * 10} points added to your account
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={restartQuiz} variant="outline">
                  Try Again
                </Button>
                <Button onClick={() => window.location.href = '/articles'} className="btn-medical-accent">
                  Read Articles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge variant="outline">
              Score: {score}/{currentQuestion + 1}
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {questions[currentQuestion].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border transition-all ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary/5 text-foreground'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="btn-medical-accent"
              >
                {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;