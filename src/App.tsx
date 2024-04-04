import { useEffect, useState } from "react";
import star from "./img/star.svg";

interface SaveData {
  level: number;
  experience: number;
  commissions: string[];
}

const fibonacci = (n: number): number => {
  return n < 1 ? 0 : n <= 2 ? 1 : fibonacci(n - 1) + fibonacci(n - 2);
};

const App = () => {
  const storageData = localStorage.getItem("saveData");
  const [saveData, setSaveData] = useState<SaveData>(
    storageData
      ? JSON.parse(storageData)
      : {
          level: 1,
          experience: 0,
          commissions: [],
        }
  );
  const [text, setText] = useState<string>("");

  const baseExperience = 100;
  const nextExperience = baseExperience * fibonacci(saveData.level + 1);

  useEffect(() => {
    localStorage.setItem("saveData", JSON.stringify(saveData));
  }, [saveData]);

  const handleAddCommission = () => {
    if (text !== "") {
      setSaveData((prev) => ({
        commissions: [...prev.commissions, text],
        level: prev.level,
        experience: prev.experience,
      }));
      setText("");
    }
  };

  const handleCompleteCommission = () => {
    setSaveData((prev) => {
      let newExp = prev.experience + 10;
      let newLvl = prev.level;
      if (newExp >= nextExperience) {
        newExp -= nextExperience;
        newLvl += 1;
      }
      return {
        commissions: prev.commissions,
        level: newLvl,
        experience: newExp,
      };
    });
  };

  return (
    <>
      <header className="flex justify-center items-center text-5xl gap-2">
        Commissions
      </header>
      <main className="flex flex-col justify-center items-center gap-4 m-4">
        <div className="flex justify-center items-center gap-2">
          <span>Rank. {saveData.level}</span>
          <progress value={saveData.experience} max={nextExperience} />
          {saveData.experience}/{nextExperience}
        </div>
        <div className="flex flex-col">
          {saveData.commissions.map((title) => (
            <div className="flex text-lg gap-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    handleCompleteCommission();
                  }
                }}
              />
              <span>{title}</span>
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
    </>
  );
};

export { App };
