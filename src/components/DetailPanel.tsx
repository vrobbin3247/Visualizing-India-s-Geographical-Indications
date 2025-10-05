import React from "react";

interface GI {
  id: string;
  name: string;
  type: string;
  states: string[];
  info: string;
  coordinates: { state: string; lat: number; lng: number }[];
  primaryState: string;
  stateCount: number;
}

interface DetailPanelProps {
  selectedGI: GI | null;
  onClose: () => void;
  onNext: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({
  selectedGI,
  onClose,
  onNext,
}) => {
  if (!selectedGI) {
    return null;
  }

  return (
    <div className="h-full bg-transparent p-8">
      <button onClick={onClose} className="mb-4">
        ← Back
      </button>
      <h1 className="text-3xl font-bold mb-2">{selectedGI.name}</h1>
      <p className="text-base leading-relaxed mb-4">
        <strong>Type:</strong> {selectedGI.type}
      </p>
      <p className="text-base leading-relaxed mb-4">
        <strong>States:</strong> {selectedGI.states.join(", ")}
      </p>
      <div className="description">{selectedGI.info}</div>
      <button
        onClick={onNext}
        className="mt-8 w-full bg-gray-800 text-white py-2 rounded flex justify-center items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </button>
    </div>
  );
};

export default DetailPanel;
