import { useEffect, useState } from "react";
import CloseIcon from "./img/close.svg";

interface SaveData {
  level: number;
  money: number;
  experience: number;
  streak: number;
  commissions: Commission[];
  is_completed: boolean;
  completion_day: number;
}

interface Commission {
  name: string;
  complete: boolean;
}

const fibonacci = (n: number): number => {
  return n < 1 ? 0 : n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
};

const App = () => {
  const currentDay = new Date().getDay();

  const storageData = localStorage.getItem("saveData");
  const [saveData, setSaveData] = useState<SaveData>(
    storageData
      ? JSON.parse(storageData)
      : {
          level: 1,
          money: 0,
          experience: 0,
          streak: 0,
          commissions: [],
          is_completed: false,
          completion_day: new Date().getDay(),
        }
  );
  const [text, setText] = useState<string>("");
  const [deleteShowIndex, setDeleteShowIndex] = useState<number | null>(null);

  const baseExperience = 100;
  const nextExperience = baseExperience * fibonacci(saveData.level + 1);

  useEffect(() => {
    if (saveData.completion_day !== currentDay) {
      setSaveData((prev) => ({
        ...prev,
        commissions: prev.commissions.map((comm) => ({
          ...comm,
          complete: false,
        })),
        is_completed: false,
        completion_day: currentDay,
      }));
    }
  }, [saveData.completion_day, currentDay]);

  useEffect(() => {
    localStorage.setItem("saveData", JSON.stringify(saveData));
  }, [saveData]);

  const handleAddCommission = () => {
    if (text !== "") {
      setSaveData((prev) => ({
        ...prev,
        commissions: [
          ...prev.commissions,
          {
            name: text,
            complete: false,
          },
        ],
      }));
      setText("");
    }
  };

  const completeCommission = (index: number) => {
    setSaveData((prev) => {
      let newExp = prev.experience + 10;
      let newLvl = prev.level;
      let newMoney = prev.money + 20;
      if (newExp >= nextExperience) {
        newExp -= nextExperience;
        newLvl += 1;
      }
      if (
        saveData.commissions.filter((comm) => !comm.complete).length === 0 &&
        !saveData.is_completed
      ) {
        newMoney += 100;
      }
      prev.commissions[index].complete = true;
      return {
        ...prev,
        level: newLvl,
        experience: newExp,
        money: newMoney,
      };
    });
  };

  const deleteCommission = (index: number) => {
    setSaveData((prev) => ({
      ...prev,
      commissions: prev.commissions.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <main className="flex flex-col justify-center items-center gap-4 m-4">
        <div>
          <header className="flex justify-center items-center text-5xl gap-2">
            Commissions
          </header>
          <div className="flex flex-col justify-center items-center">
            <span className="text-2xl">Rank. {saveData.level}</span>
            <progress
              className="w-full"
              value={saveData.experience}
              max={nextExperience}
            />
            <div className="flex flex-row justify-center">
              <span>${saveData.money}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {saveData.commissions.map((comm, index) => (
            <div className="flex text-lg gap-2">
              <input
                type="checkbox"
                checked={comm.complete}
                onChange={(e) => {
                  if (e.target.checked) {
                    completeCommission(index);
                  }
                }}
              />
              <div
                className="flex text-lg gap-1"
                onMouseOver={() => setDeleteShowIndex(index)}
                onMouseLeave={() => setDeleteShowIndex(null)}
              >
                <span>{comm.name}</span>
                <button
                  className="flex items-center"
                  onClick={() => deleteCommission(index)}
                >
                  <img
                    alt="close"
                    src={CloseIcon}
                    width={20}
                    style={{ opacity: Number(deleteShowIndex === index) }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center">
          <div className="flex flex-row border-gray-400 border-2 rounded-md items-center">
            <input
              type="text"
              placeholder="Add a new commission..."
              className="p-2"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              className="text-2xl bg-gray-400 p-2 px-4 text-white font-bold"
              onClick={handleAddCommission}
            >
              +
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export { App };
