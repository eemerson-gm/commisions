import { useState } from "react";
import star from "./img/star.svg";

const App = () => {
  const [commissions, setCommissions] = useState<string[]>([]);
  const [level, setLevel] = useState<number>(0);
  const [experience, setExperience] = useState<number>(0);
  const [text, setText] = useState<string>("");

  const handleAddCommission = () => {
    if (text !== "") {
      setCommissions((prev) => [...prev, text]);
      setText("");
    }
  };

  const handleCompleteCommission = () => {
    setExperience((prev) => prev + 10);
  };

  return (
    <>
      <header className="flex justify-center items-center text-5xl gap-2">
        Commissions
      </header>
      <main className="flex flex-col justify-center items-center gap-4 m-4">
        <div className="flex justify-center items-center gap-2">
          <span>LV. {level}</span>
          <progress value={experience} max={100} />
        </div>
        <div className="flex flex-col">
          {commissions.map((title) => (
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
