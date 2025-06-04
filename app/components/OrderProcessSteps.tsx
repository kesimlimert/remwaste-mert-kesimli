import "../styles/OrderProcessSteps.css";

interface OrderProcessStepsProps {
  currentStep?: number;
}

export function OrderProcessSteps({ currentStep = 3 }: OrderProcessStepsProps) {
  const steps = [
    { id: 1, name: "Postcode", description: "Enter your location" },
    { id: 2, name: "Waste Type", description: "Select waste category" },
    { id: 3, name: "Select Skip", description: "Choose skip size" },
    { id: 4, name: "Permit Check", description: "Check requirements" },
    { id: 5, name: "Choose Date", description: "Pick delivery date" },
    { id: 6, name: "Payment", description: "Complete order" },
  ];

  const getStepClass = (stepId: number) => {
    if (stepId < currentStep) return "step completed";
    if (stepId === currentStep) return "step active";
    return "step";
  };

  return (
    <div className="order-process-steps">
      <div className="steps-container">
        {steps.map((step, index) => (
          <div key={step.id} className="step-wrapper">
            <div className={getStepClass(step.id)}>
              <div className="step-number">
                {step.id < currentStep ? "✓" : step.id}
              </div>
              <div className="step-content">
                <div className="step-name">{step.name}</div>
                <div className="step-description">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`step-connector ${step.id < currentStep ? "completed" : ""}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 