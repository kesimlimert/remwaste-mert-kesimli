import { useState } from "react";
import type { Skip } from "../routes/+types/home";
import "../styles/SkipFilterWizard.css";

interface SkipFilterWizardProps {
  skips: Skip[];
  onFilterComplete: (filteredSkips: Skip[]) => void;
}

type Step = "hire_period" | "size" | "road_placement" | "complete";

export function SkipFilterWizard({ skips, onFilterComplete }: SkipFilterWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>("hire_period");
  const [hirePeriod, setHirePeriod] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [roadPlacement, setRoadPlacement] = useState<boolean | null>(null);

  // Get unique available sizes from skips
  const availableSizes = [...new Set(skips.map(skip => skip.size))].sort((a, b) => a - b);

  const nextStep = () => {
    switch (currentStep) {
      case "hire_period":
        setCurrentStep("size");
        break;
      case "size":
        setCurrentStep("road_placement");
        break;
      case "road_placement":
        setCurrentStep("complete");
        applyFilters();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "size":
        setCurrentStep("hire_period");
        break;
      case "road_placement":
        setCurrentStep("size");
        break;
      case "complete":
        setCurrentStep("road_placement");
        break;
    }
  };

  const toggleSizeSelection = (size: number) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const applyFilters = () => {
    let filteredResults = [...skips];

    // Filter by hire period if selected
    if (hirePeriod !== null) {
      filteredResults = filteredResults.filter(skip => skip.hire_period_days === hirePeriod);
    }

    // Filter by selected sizes if any
    if (selectedSizes.length > 0) {
      filteredResults = filteredResults.filter(skip => selectedSizes.includes(skip.size));
    }

    // Filter by road placement if selected
    if (roadPlacement !== null) {
      filteredResults = filteredResults.filter(skip => skip.allowed_on_road === roadPlacement);
    }

    onFilterComplete(filteredResults);
  };

  const resetFilters = () => {
    setHirePeriod(null);
    setSelectedSizes([]);
    setRoadPlacement(null);
    setCurrentStep("hire_period");
  };

  const renderFilterSummary = () => {
    return (
      <div className="filter-summary">
        <h3>Your Filter Selections</h3>
        <ul>
          <li>
            <strong>Hire Period:</strong> {hirePeriod ? `${hirePeriod} days` : "Any"}
          </li>
          <li>
            <strong>Skip Sizes:</strong>{" "}
            {selectedSizes.length > 0 
              ? selectedSizes.sort((a, b) => a - b).map(size => `${size} yard`).join(", ")
              : "Any"}
          </li>
          <li>
            <strong>Road Placement:</strong>{" "}
            {roadPlacement === true 
              ? "Allowed on road" 
              : roadPlacement === false 
                ? "Not allowed on road" 
                : "Any"}
          </li>
        </ul>
        <button className="edit-filters-button" onClick={() => setCurrentStep("hire_period")}>
          Edit Filters
        </button>
      </div>
    );
  };

  const renderHirePeriodStep = () => (
    <div className="step-content">
      <h3>Step 1: Select Hire Period</h3>
      <div className="hire-period-options">
        <button 
          className={hirePeriod === 7 ? "selected" : ""} 
          onClick={() => setHirePeriod(7)}
        >
          7 Days
        </button>
        <button 
          className={hirePeriod === 14 ? "selected" : ""} 
          onClick={() => setHirePeriod(14)}
        >
          14 Days
        </button>
      </div>
    </div>
  );

  const renderSizeStep = () => (
    <div className="step-content">
      <h3>Step 2: Select Skip Size (Yards)</h3>
      <div className="size-options">
        {availableSizes.map(size => (
          <button 
            key={size}
            className={selectedSizes.includes(size) ? "selected" : ""}
            onClick={() => toggleSizeSelection(size)}
          >
            {size} Yard
          </button>
        ))}
      </div>
      <p className="helper-text">Select multiple sizes if needed</p>
    </div>
  );

  const renderRoadPlacementStep = () => (
    <div className="step-content">
      <h3>Step 3: Road Placement</h3>
      <div className="road-placement-options">
        <button 
          className={roadPlacement === true ? "selected" : ""} 
          onClick={() => setRoadPlacement(true)}
        >
          Allowed on Road
        </button>
        <button 
          className={roadPlacement === false ? "selected" : ""} 
          onClick={() => setRoadPlacement(false)}
        >
          Not Allowed on Road
        </button>
        <button 
          className={roadPlacement === null ? "selected" : ""} 
          onClick={() => setRoadPlacement(null)}
        >
          No Preference
        </button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case "hire_period":
        return renderHirePeriodStep();
      case "size":
        return renderSizeStep();
      case "road_placement":
        return renderRoadPlacementStep();
      case "complete":
        return renderFilterSummary();
    }
  };

  return (
    <div className="skip-filter-wizard">
      <div className="wizard-progress">
        <div className={`step ${currentStep === "hire_period" ? "active" : "completed"}`}>1</div>
        <div className="line"></div>
        <div className={`step ${currentStep === "size" ? "active" : currentStep === "road_placement" || currentStep === "complete" ? "completed" : ""}`}>2</div>
        <div className="line"></div>
        <div className={`step ${currentStep === "road_placement" ? "active" : currentStep === "complete" ? "completed" : ""}`}>3</div>
      </div>

      <div className="wizard-content">
        {renderStepContent()}
        
        {currentStep !== "complete" && (
          <div className="wizard-buttons">
            {currentStep !== "hire_period" && (
              <button className="back-button" onClick={prevStep}>
                Back
              </button>
            )}
            
            <button 
              className="next-button" 
              onClick={nextStep}
              disabled={currentStep === "hire_period" && hirePeriod === null || 
                      currentStep === "size" && selectedSizes.length === 0}
            >
              Next
            </button>
            
            <button className="reset-button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 