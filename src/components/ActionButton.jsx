import React from "react";
import "./ActionButton.css";

function ActionButton({
  onClick,
  onTableButtonClick,
  tableVisible,
  formVisible,
}) {
  return (
    <div className="action-button">
      {/* Container for action buttons */}
      <nav className="leader-1">
        {/* Button to view data table */}
        <button
          className="btn btn-large btn-grouped"
          onClick={onTableButtonClick}
          title="View Data Table"
          style={{ backgroundColor: tableVisible && "rgb(19, 90, 130)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="svg-icon"
          >
            <path d="M2 2v26h30V2H2zm14 7.999h6V14h-6V9.999zM16 16h6v4h-6v-4zm-2 10H4v-4h10v4zm0-6H4v-4h10v4zm0-6H4V9.999h10V14zm2 12v-4h6v4h-6zm14 0h-6v-4h6v4zm0-6h-6v-4h6v4zm0-6h-6V9.999h6V14z" />
          </svg>
        </button>
        {/* Button to open submit feedback form */}
        <button
          className="btn btn-large btn-grouped"
          onClick={onClick}
          title="Submit Feedback"
          style={{ backgroundColor: formVisible && "rgb(19, 90, 130)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="svg-icon"
          >
            <path d="M0 4v24h32V4H0zm30 2v.519l-14.051 9.395L2 6.581V6h28zM2 26V8.649l12.039 7.991 1.91 1.359 1.91-1.359v.001L30 8.577v17.422H2z" />
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default ActionButton;
