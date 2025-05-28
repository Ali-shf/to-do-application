import { useState } from "react";
import ToDOList from "./components/toDOList";

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Groceries", "College", "Paymenys"];
  return (
    <div className="flex justify-center items-center h-screen bg-[#EA5959]">
      <div
        id="container"
        className="bg-white flex rounded-lg shadow-[0px_10px_10px_0_#00000040] w-3/4 h-3/4"
      >
        <aside className="mt-[139px] ml-11">
          <ul className="flex items-start flex-col justify gap-6">
            {categories.map((category) => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`cursor-pointer transition-colors ${
                    selectedCategory === category ? "text-[#EA5959]" : ""
                  }`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <div className="border ml-15 border-[#D8D8D8]"></div>
        <section className="pl-8 w-full">
          <header className="py-5">
            <h1 className="text-[32px] font-bold text-[#000000]">{selectedCategory} Tasks</h1>
          </header>
          <ToDOList selectedCategory={selectedCategory} />
        </section>
      </div>
    </div>
  );
};

export default App;
