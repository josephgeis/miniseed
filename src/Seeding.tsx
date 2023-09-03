import { RosterEntry } from "./types";

interface SeedingProps {
  roster: RosterEntry[];
  lanes: number;
  updateLanes: (newLanes: number) => void;
  hasSavedStartList: boolean;
  onEdit: () => void;
  onSeed: () => void;
  onRecall: () => void;
  onToggleName: (index: number) => void;
  onNameUp: (index: number) => void;
  onNameDown: (index: number) => void;
}

function Seeding({
  roster,
  lanes,
  updateLanes,
  hasSavedStartList,
  onEdit,
  onSeed,
  onRecall,
  onToggleName,
  onNameUp,
  onNameDown,
}: SeedingProps) {
  return (
    <div className="space-y-2">
      <h1>Rank Names</h1>
      <div className="flex gap-x-2">
        <button
          className="btn-secondary"
          onClick={() => {
            onEdit();
          }}
        >
          Edit Names
        </button>
        <button
          className="btn-primary"
          onClick={() => {
            onSeed();
          }}
        >
          Seed
        </button>
        {hasSavedStartList && (
          <button
            className="btn-secondary"
            onClick={() => {
              onRecall();
            }}
          >
            Recall Start List
          </button>
        )}
      </div>
      <div className="space-x-2">
        <label htmlFor="lanes">Lanes:</label>
        <input
          type="number"
          id="lanes"
          className="border rounded"
          value={lanes}
          onChange={(e) => {
            const newLanes = parseInt(e.target.value);
            if (isNaN(newLanes)) {
              updateLanes(8);
            } else {
              updateLanes(newLanes);
            }
          }}
        />
      </div>
      <div className="flex flex-col gap-y-2">
        {roster.length > 0 ? (
          roster.map((v, i) => (
            <div
              className={
                "p-2 rounded-md flex gap-x-1 text-lg h-12 items-center " +
                (v.active ? "bg-blue-300 " : "bg-gray-200")
              }
              key={v.name}
              onClick={() => {
                onToggleName(i);
              }}
            >
              <p className="font-semibold flex-grow">{v.name}</p>
              {i != 0 ? (
                <button
                  className="bg-gray-500 w-10 h-8 rounded-md text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNameUp(i);
                  }}
                >
                  ↑
                </button>
              ) : (
                <div className="w-10 h-8"></div>
              )}
              {i != roster.length - 1 ? (
                <button
                  className="bg-gray-500 w-10 h-8 rounded-md text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNameDown(i);
                  }}
                >
                  ↓
                </button>
              ) : (
                <div className="w-10 h-8"></div>
              )}
            </div>
          ))
        ) : (
          <p className="font-bold">
            No names in roster. Click <i>Edit Names</i> to build roster.
          </p>
        )}
      </div>
    </div>
  );
}

export default Seeding;
