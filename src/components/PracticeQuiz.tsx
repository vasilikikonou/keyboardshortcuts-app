import { Check, RotateCcw, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import { type Platform, type Shortcut } from "@/lib/shortcuts";

type PracticeQuizProps = {
  shortcuts: Shortcut[];
  platform: Platform;
  onClose: () => void;
};

type QuizOption = {
  id: string;
  text: string;
};

type QuizQuestion = {
  id: string;
  title: string;
  app: string;
  answer: QuizOption;
  options: QuizOption[];
};

function comboFor(shortcut: Shortcut, platform: Platform) {
  return (shortcut.keys[platform] ?? []).join(
    shortcut.sequence ? " → " : " + "
  );
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const replacement = Math.floor(Math.random() * (index + 1));
    [result[index], result[replacement]] = [result[replacement], result[index]];
  }
  return result;
}

function buildQuestions(
  shortcuts: Shortcut[],
  platform: Platform
): QuizQuestion[] {
  const available = shortcuts.filter(
    shortcut =>
      (shortcut.keys[platform] ?? []).length > 0 && comboFor(shortcut, platform)
  );
  const selected = shuffle(available).slice(0, Math.min(5, available.length));

  return selected.map(answerShortcut => {
    const answer: QuizOption = {
      id: answerShortcut.id,
      text: comboFor(answerShortcut, platform),
    };
    const seenTexts = new Set([answer.text]);
    const distractors = shuffle(available)
      .filter(candidate => candidate.id !== answerShortcut.id)
      .map(candidate => ({
        id: candidate.id,
        text: comboFor(candidate, platform),
      }))
      .filter(candidate => {
        if (seenTexts.has(candidate.text)) return false;
        seenTexts.add(candidate.text);
        return true;
      })
      .slice(0, 3);

    return {
      id: answerShortcut.id,
      title: answerShortcut.title,
      app: answerShortcut.app,
      answer,
      options: shuffle([answer, ...distractors]),
    };
  });
}

export default function PracticeQuiz({
  shortcuts,
  platform,
  onClose,
}: PracticeQuizProps) {
  const shortcutSignature = useMemo(
    () =>
      shortcuts
        .map(
          shortcut =>
            `${shortcut.id}:${(shortcut.keys[platform] ?? []).join(",")}:${shortcut.sequence ?? false}`
        )
        .join("|"),
    [platform, shortcuts]
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    buildQuestions(shortcuts, platform)
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    setQuestions(buildQuestions(shortcuts, platform));
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setComplete(false);
  }, [platform, shortcutSignature]);

  const question = questions[questionIndex];
  const answered = selectedOption !== null;
  const isCorrect = answered && selectedOption === question?.answer.text;

  const chooseOption = (option: QuizOption) => {
    if (answered) return;
    setSelectedOption(option.text);
    if (option.text === question.answer.text)
      setScore(currentScore => currentScore + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      setComplete(true);
      return;
    }
    setQuestionIndex(currentIndex => currentIndex + 1);
    setSelectedOption(null);
  };

  const restart = () => {
    setQuestions(buildQuestions(shortcuts, platform));
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setComplete(false);
  };

  return (
    <Dialog.Root
      open={true}
      onOpenChange={open => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content
          className="modal-panel quiz-panel"
          aria-describedby="practice-quiz-description"
        >
          <div className="modal-topline">
            <span>Practice quiz</span>
            <Dialog.Close asChild>
              <button
                className="modal-close"
                type="button"
                aria-label="Close practice quiz"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Title>Test your shortcuts</Dialog.Title>
          <Dialog.Description id="practice-quiz-description">
            Choose the correct key combination for each action. No keyboard
            shortcuts are captured or run.
          </Dialog.Description>

          {questions.length === 0 ? (
            <div className="quiz-result">
              <p>
                No {platform} shortcut mappings are available to practice yet.
              </p>
              <button
                className="primary-button"
                type="button"
                onClick={onClose}
              >
                Close quiz
              </button>
            </div>
          ) : complete ? (
            <div className="quiz-result">
              <Check aria-hidden="true" size={28} />
              <h2>Practice complete</h2>
              <p>
                You scored {score} out of {questions.length}.
              </p>
              <button
                className="primary-button"
                type="button"
                onClick={restart}
              >
                <RotateCcw aria-hidden="true" size={17} />
                Practice again
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={onClose}
              >
                Close quiz
              </button>
            </div>
          ) : (
            <>
              <p className="quiz-progress">
                Question {questionIndex + 1} of {questions.length} · Score:{" "}
                {score}
              </p>
              <section
                className="quiz-question"
                aria-labelledby="quiz-question-title"
              >
                <h2 id="quiz-question-title">
                  What keys perform “{question.title}” in {question.app}?
                </h2>
              </section>
              <div
                className="quiz-options"
                role="group"
                aria-label="Answer choices"
              >
                {question.options.map(option => {
                  const selected = selectedOption === option.text;
                  const optionClass = answered
                    ? `quiz-option ${option.text === question.answer.text ? "correct" : selected ? "incorrect" : ""}`
                    : "quiz-option";
                  return (
                    <button
                      className={optionClass}
                      type="button"
                      key={`${question.id}-${option.id}`}
                      onClick={() => chooseOption(option)}
                      disabled={answered}
                      aria-pressed={selected}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className="quiz-feedback" role="status">
                  <p>
                    {isCorrect
                      ? "Correct — nice work."
                      : `Not quite. The correct combination is ${question.answer.text}.`}
                  </p>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={nextQuestion}
                  >
                    {questionIndex === questions.length - 1
                      ? "See results"
                      : "Next question"}
                  </button>
                </div>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
