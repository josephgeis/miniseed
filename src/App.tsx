import { useEffect, useState } from "react";
import Names from "./Names";
import Seeding from "./Seeding";
import _ from "lodash";
import { Heat, RosterEntry } from "./types";
import StartList from "./StartList";

enum Steps {
  Names,
  Seeding,
  StartList,
}

function App() {
  let [step, updateStep] = useState(Steps.Seeding);
  let [roster, updateRosterState] = useState<RosterEntry[]>([]);
  let [lanes, updateLanesState] = useState(8);
  let [startList, updateStartListState] = useState<Heat[]>();

  useEffect(() => {
    // Load saved roster (if available and valid)
    try {
      const savedRosterString = localStorage.getItem("roster");
      if (savedRosterString != null) {
        const savedRosterNames = JSON.parse(savedRosterString);
        const newRoster = savedRosterNames.map((v: string) => ({
          name: v,
          active: false,
        }));
        updateRosterState(newRoster);
      }
    } catch {
      localStorage.setItem("roster", "[]");
    }

    // Load number of lanes
    const savedLanesString = localStorage.getItem("lanes") || "";
    const savedLanes = parseInt(savedLanesString);

    if (isNaN(savedLanes)) {
      localStorage.setItem("lanes", "8");
      updateLanesState(8);
    } else {
      updateLanesState(savedLanes);
    }

    // Load previous start list (if available and valid)
    try {
      const savedStartListString = localStorage.getItem("startList");
      if (savedStartListString != null) {
        const savedStartList = JSON.parse(savedStartListString);
        updateStartListState(savedStartList);
      }
    } catch {
      localStorage.removeItem("startList");
    }
  }, []);

  const updateLanes = (newLanes: number) => {
    localStorage.setItem("lanes", newLanes.toString());
    updateLanesState(newLanes);
  };

  const updateRoster = (newRoster: RosterEntry[]) => {
    const rosterNames = newRoster.map((v) => v.name);
    localStorage.setItem("roster", JSON.stringify(rosterNames));
    updateRosterState(newRoster);
  };

  const updateStartList = (newStartList: Heat[] | null) => {
    if (newStartList == null) {
      localStorage.removeItem("startList");
      updateStartListState(undefined);
    } else {
      localStorage.setItem("startList", JSON.stringify(newStartList));
      updateStartListState(newStartList);
    }
  };

  const onEditCancel = () => {
    updateStep(Steps.Seeding);
  };

  const onEditSave = (names: string) => {
    updateStep(Steps.Seeding);

    let newNames = names.split("\n").filter((v) => v != "");
    newNames = _.uniq(newNames);

    let newRoster = newNames.map((v) => ({
      name: v,
      active: false,
    }));

    updateRoster(newRoster);
  };

  const onSeedingEdit = () => {
    updateStep(Steps.Names);
  };

  const onSeedingToggleName = (index: number) => {
    const newRoster = roster.map((v, i) =>
      i == index
        ? {
            name: v.name,
            active: !v.active,
          }
        : v
    );
    updateRoster(newRoster);
  };

  const onSeedingNameUp = (index: number) => {
    if (index == 0) return;
    const newRoster = [
      ...roster.slice(0, index - 1),
      roster[index],
      roster[index - 1],
      ...roster.slice(index + 1),
    ];
    updateRoster(newRoster);
  };

  const onSeedingNameDown = (index: number) => {
    if (index == roster.length - 1) return;
    const newRoster = [
      ...roster.slice(0, index),
      roster[index + 1],
      roster[index],
      ...roster.slice(index + 2),
    ];
    updateRoster(newRoster);
  };

  const onSeedingSeed = () => {
    const activeRosterNames = roster.filter((v) => v.active).map((v) => v.name);

    const heats: Heat[] = [];

    const newHeat = () =>
      [new Array<string | null>(lanes).fill(null), Math.ceil(lanes / 2), 0] as [
        Array<string | null>,
        number,
        number
      ];

    let [currentHeat, currentLane, heatSize] = newHeat();

    while (activeRosterNames.length > 0) {
      // If heat is full, or if completing this heat would result in a heat of 1 (given we have 3+ lanes), create a new heat
      if (
        heatSize == lanes ||
        (lanes > 2 && heatSize + 1 == lanes && activeRosterNames.length == 2)
      ) {
        heats.push(currentHeat);
        [currentHeat, currentLane, heatSize] = newHeat();
      }

      currentHeat[currentLane - 1] = activeRosterNames.shift() || null;
      heatSize++;
      currentLane += heatSize % 2 == 1 ? heatSize : -heatSize;
    }

    // Push our last heat if not empty
    if (heatSize > 0) {
      heats.push(currentHeat);
    }

    if (heats.length == 0) {
      window.alert(
        "No heats could be seeded. Please select swimmers to include."
      );
      return;
    }

    // Update our start list (and save it)
    updateStartList(heats);

    // Show the start list
    updateStep(Steps.StartList);
  };

  const onSeedingRecall = () => {
    updateStep(Steps.StartList);
  };

  const onStartListGoBack = () => {
    updateStep(Steps.Seeding);
  };

  const onStartListClear = () => {
    updateStartList(null);
    updateStep(Steps.Seeding);
  };

  // MARK: Routing & render

  if (step == Steps.Names) {
    return (
      <Names
        defaultNames={roster.map((v) => v.name).join("\n")}
        onSave={onEditSave}
        onCancel={onEditCancel}
      />
    );
  } else if (step == Steps.StartList) {
    return (
      <StartList
        startList={startList!}
        onGoBack={onStartListGoBack}
        onClear={onStartListClear}
      />
    );
  } else {
    return (
      <Seeding
        roster={roster}
        lanes={lanes}
        updateLanes={updateLanes}
        hasSavedStartList={startList != null}
        onEdit={onSeedingEdit}
        onToggleName={onSeedingToggleName}
        onNameUp={onSeedingNameUp}
        onNameDown={onSeedingNameDown}
        onSeed={onSeedingSeed}
        onRecall={onSeedingRecall}
      />
    );
  }
}

export default App;
