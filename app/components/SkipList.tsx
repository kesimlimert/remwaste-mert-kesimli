import { useState, useEffect } from "react";
import type { Skip } from "../routes/+types/home";
import { getSkipsByLocation } from "../api/skips";
import { SkipFilterBadges } from "./SkipFilterBadges";
import "../styles/SkipList.css";

interface SkipListProps {
  postcode?: string;
  area?: string;
}

export function SkipList({
  postcode = "NR32",
  area = "Lowestoft",
}: SkipListProps) {
  const [allSkips, setAllSkips] = useState<Skip[]>([]);
  const [displayedSkips, setDisplayedSkips] = useState<Skip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);

  useEffect(() => {
    async function loadSkips() {
      try {
        setLoading(true);
        const data = await getSkipsByLocation(postcode, area);
        setAllSkips(data);
        setDisplayedSkips(data);
        setError(null);
      } catch (err) {
        setError("Failed to load skip data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSkips();
  }, [postcode, area]);

  const handleFilterChange = (filteredSkips: Skip[]) => {
    setDisplayedSkips(filteredSkips);
    setIsFiltered(filteredSkips.length !== allSkips.length);
  };

  const handleCardClick = (skipId: number) => {
    setSelectedSkipId(selectedSkipId === skipId ? null : skipId);
  };

  const selectedSkip = selectedSkipId ? displayedSkips.find(skip => skip.id === selectedSkipId) : null;

  if (loading) return <div>Loading skip data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (allSkips.length === 0)
    return <div>No skips available for this location</div>;

  return (
    <div className="skip-list">
      <SkipFilterBadges skips={allSkips} onFilterChange={handleFilterChange} />

      {isFiltered && displayedSkips.length === 0 ? (
        <div className="no-results">
          <p>No skips match your selected filters.</p>
          <p>Please try different filter options.</p>
        </div>
      ) : (
        <>
          <div className="skip-grid">
            {displayedSkips.map((skip) => (
              <div
                key={skip.id}
                className={`skip-card ${
                  selectedSkipId === skip.id ? "selected" : ""
                }`}
                onClick={() => handleCardClick(skip.id)}
              >
                {!skip.allowed_on_road && (
                  <div className="road-placement-error">
                    <span className="error-icon">⚠️</span>
                    Not Allowed On The Road
                  </div>
                )}
                <div className="card-content">
                  <h3>{skip.size} Yard Skip</h3>
                  <p className="card-period">
                    Hire period: {skip.hire_period_days} days
                  </p>
                  <p className="card-price">£{skip.price_before_vat}</p>
                </div>
                {selectedSkipId === skip.id && (
                  <div className="skip-image-container">
                    <img
                      src="https://yozbrydxdlcxghkphhtq.supabase.co/storage/v1/object/public/skips/skip-sizes/4-yarder-skip.jpg"
                      alt={`${skip.size} Yard Skip`}
                      className="skip-image"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedSkip && (
            <div className="sticky-bottom-bar">
              <div className="selected-skip-info">
                <div className="selected-skip-details">
                  <span className="selected-size">{selectedSkip.size} Yard Skip</span>
                  <span className="selected-price">£{selectedSkip.price_before_vat}</span>
                </div>
                <div className="sticky-buttons">
                  <button className="back-button" onClick={() => setSelectedSkipId(null)}>
                    Back
                  </button>
                  <button className="continue-button">
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
