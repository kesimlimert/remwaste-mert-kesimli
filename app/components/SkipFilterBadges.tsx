import { useState, useRef, useEffect } from "react";
import type { Skip } from "../routes/+types/home";
import "../styles/SkipFilterBadges.css";

interface SkipFilterBadgesProps {
  skips: Skip[];
  onFilterChange: (filteredSkips: Skip[]) => void;
}

type PopupType = "hire_period" | "size" | "road_placement" | null;

export function SkipFilterBadges({ skips, onFilterChange }: SkipFilterBadgesProps) {
  const [hirePeriod, setHirePeriod] = useState<number | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([]);
  const [roadPlacement, setRoadPlacement] = useState<boolean | null>(null);
  const [activePopup, setActivePopup] = useState<PopupType>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Get unique available sizes and hire periods from skips
  const availableSizes = [...new Set(skips.map(skip => skip.size))].sort((a, b) => a - b);
  const availableHirePeriods = [7, 14]; // Always show 7 and 14 day options

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePopup(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters();
  }, [hirePeriod, selectedSizes, roadPlacement]);

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

    onFilterChange(filteredResults);
  };

  const toggleSizeSelection = (size: number) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const clearAllFilters = () => {
    setHirePeriod(null);
    setSelectedSizes([]);
    setRoadPlacement(null);
    setActivePopup(null);
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case "hire_period":
        return hirePeriod ? `${hirePeriod} Days` : "Hire Period";
      case "size":
        if (selectedSizes.length === 0) return "Skip Size";
        if (selectedSizes.length === 1) return `${selectedSizes[0]} Yard`;
        return `${selectedSizes.length} Sizes`;
      case "road_placement":
        if (roadPlacement === true) return "Road Allowed";
        return "Road Placement";
      default:
        return "";
    }
  };

  const getBadgeClass = (type: string) => {
    const baseClass = "filter-badge";
    const isActive = activePopup === type;
    switch (type) {
      case "hire_period":
        return `${baseClass} ${hirePeriod ? "active" : ""} ${isActive ? "open" : ""}`;
      case "size":
        return `${baseClass} ${selectedSizes.length > 0 ? "active" : ""} ${isActive ? "open" : ""}`;
      case "road_placement":
        return `${baseClass} ${roadPlacement !== null ? "active" : ""} ${isActive ? "open" : ""}`;
      default:
        return baseClass;
    }
  };

  const renderPopupContent = () => {
    switch (activePopup) {
      case "hire_period":
        return (
          <div className="popup-content">
            <h4>Select Hire Period</h4>
            <div className="popup-options">
              {availableHirePeriods.map(period => (
                <button
                  key={period}
                  className={hirePeriod === period ? "selected" : ""}
                  onClick={() => {
                    setHirePeriod(period);
                    setActivePopup(null);
                  }}
                >
                  {period} Days
                </button>
              ))}
              <button
                className={hirePeriod === null ? "selected" : ""}
                onClick={() => {
                  setHirePeriod(null);
                  setActivePopup(null);
                }}
              >
                Any Period
              </button>
            </div>
          </div>
        );

      case "size":
        return (
          <div className="popup-content">
            <h4>Select Skip Sizes</h4>
            <div className="popup-options multi-select">
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
            <div className="popup-actions">
              <button className="clear-button" onClick={() => setSelectedSizes([])}>
                Clear All
              </button>
              <button className="done-button" onClick={() => setActivePopup(null)}>
                Done
              </button>
            </div>
          </div>
        );

      case "road_placement":
        return (
          <div className="popup-content">
            <h4>Road Placement</h4>
            <div className="popup-options">
              <button
                className={roadPlacement === true ? "selected" : ""}
                onClick={() => {
                  setRoadPlacement(true);
                  setActivePopup(null);
                }}
              >
                Allowed on Road
              </button>
              <button
                className={roadPlacement === null ? "selected" : ""}
                onClick={() => {
                  setRoadPlacement(null);
                  setActivePopup(null);
                }}
              >
                Any
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters = hirePeriod !== null || selectedSizes.length > 0 || roadPlacement !== null;

  return (
    <div className="skip-filter-badges" ref={containerRef}>
      <div className="badges-container">
        <button
          className={getBadgeClass("hire_period")}
          onClick={() => setActivePopup(activePopup === "hire_period" ? null : "hire_period")}
        >
          {getBadgeText("hire_period")}
          <span className="badge-arrow">▼</span>
        </button>

        <button
          className={getBadgeClass("size")}
          onClick={() => setActivePopup(activePopup === "size" ? null : "size")}
        >
          {getBadgeText("size")}
          <span className="badge-arrow">▼</span>
        </button>

        <button
          className={getBadgeClass("road_placement")}
          onClick={() => setActivePopup(activePopup === "road_placement" ? null : "road_placement")}
        >
          {getBadgeText("road_placement")}
          <span className="badge-arrow">▼</span>
        </button>

        {hasActiveFilters && (
          <button className="clear-all-button" onClick={clearAllFilters}>
            Clear All
          </button>
        )}
      </div>

      {activePopup && (
        <div className="dropdown-popup" ref={popupRef}>
          {renderPopupContent()}
        </div>
      )}
    </div>
  );
} 