import type React from "react";

interface IChangeProps {
  category: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const DropDown = ({ category, onChange }: IChangeProps) => {
  return (
    <div>
      <select
        data-testid="category"
        value={category}
        name="category"
        onChange={onChange}
        className="bg-[#F3F3F3] p-3 rounded-lg w-full"
      >
        <option value="Pick your category">Pick your category</option>
        <option value="Groceries">Groceries</option>
        <option value="College">College</option>
        <option value="Payments">Payments</option>
      </select>
    </div>
  );
};

export default DropDown;
