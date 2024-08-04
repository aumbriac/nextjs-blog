export default function DefaultAvatar({ name }) {
  const [first = "", last = ""] = name.split(" ");

  const firstInitial = first.charAt(0) || "";
  const lastInitial = last.charAt(0) || "";

  const initials = firstInitial + lastInitial || "?";

  return (
    <div className="relative inline-flex items-center justify-center w-12 h-12 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 me-6">
      <span className="font-medium text-gray-600 dark:text-gray-300 text-xl">
        {initials}
      </span>
    </div>
  );
}
