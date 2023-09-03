import { Heat } from "./types";

interface StartListProps {
  startList: Heat[];
  onGoBack: () => void;
  onClear: () => void;
}

function StartList({ startList, onGoBack, onClear }: StartListProps) {
  return (
    <div className="space-y-2">
      <h1>Start List</h1>
      <div className="flex gap-x-2">
        <button className="btn-secondary" onClick={() => onGoBack()}>
          Go Back
        </button>
        <button className="btn-danger" onClick={() => onClear()}>
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {startList.length > 0 ? (
          startList.map((heat, i) => (
            <div>
              <h2>
                Heat {i + 1} of {startList.length}
              </h2>
              <ol className="list-decimal">
                {heat.map((lane) =>
                  lane !== null ? (
                    <li>{lane}</li>
                  ) : (
                    <li className="text-gray-400">
                      <i>Empty</i>
                    </li>
                  )
                )}
              </ol>
            </div>
          ))
        ) : (
          <h2>No Heats</h2>
        )}
      </div>
    </div>
  );
}

export default StartList;
