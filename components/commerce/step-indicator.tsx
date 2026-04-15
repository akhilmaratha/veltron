import type { StepData } from "@/types/commerce";

interface StepIndicatorProps {
  steps: StepData[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-4 md:justify-start md:gap-8">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <span className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${isActive ? "text-primary" : isCompleted ? "text-success" : "text-text-muted"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`text-xs uppercase tracking-[0.2em] ${isActive ? "font-semibold text-text-primary" : "text-text-muted"}`}>
              {step.label}
            </span>
            {index < steps.length - 1 ? <span className="h-px w-6 bg-border" /> : null}
          </div>
        );
      })}
    </nav>
  );
}