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
        className="mt-8 w-full bg-gray-800 text-white py-2 rounded"
      >
        → Next item based on filter
      </button>
    </div>
  );
};

export default DetailPanel;
