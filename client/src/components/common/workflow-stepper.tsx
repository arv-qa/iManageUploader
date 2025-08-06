import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkflowStepperProps {
  currentStep: number;
}

export default function WorkflowStepper({ currentStep }: WorkflowStepperProps) {
  const steps = [
    { id: 1, name: "Authentication" },
    { id: 2, name: "Workspace Selection" },
    { id: 3, name: "Upload & Configure" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
                  step.id < currentStep
                    ? "bg-green-500 text-white"
                    : step.id === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.id < currentStep ? <Check size={16} /> : step.id}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  step.id < currentStep
                    ? "text-green-600"
                    : step.id === currentStep
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {step.name}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-4",
                  step.id < currentStep ? "bg-green-500" : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
