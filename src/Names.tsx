import { useState } from "react";

interface NamesProps {
  defaultNames: string;
  onSave: (names: string) => void;
  onCancel: () => void;
}

function Names({ defaultNames, onSave, onCancel }: NamesProps) {
  let [names, updateNames] = useState(defaultNames);

  return (
    <div className="space-y-2">
      <h1>Enter Names</h1>
      <textarea
        rows={10}
        value={names}
        onChange={(e) => updateNames(e.target.value)}
        className="w-full"
      ></textarea>
      <div className="flex gap-x-2">
        <button
          className="btn-secondary"
          onClick={() => {
            onCancel();
          }}
        >
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            onSave(names);
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default Names;
