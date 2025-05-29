

interface IToastProps {
  message: string;
  type: "add" | "edit" | "delete" | null;
}

const Toast = ({ message, type }: IToastProps) => {
  if (!message || !type) return null;

  const bgColor =
    type === "add"
      ? "bg-green-500"
      : type === "edit"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div
      className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white transition-opacity duration-500 ${bgColor}`}
    >
      {message}
    </div>
  );
};

export default Toast;
