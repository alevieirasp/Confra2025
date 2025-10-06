export default function Alert({ children, type = "info", className = "" }) {
  const color = {
    info: "bg-blue-50 text-blue-900 border-blue-200",
    success: "bg-green-50 text-green-900 border-green-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    danger: "bg-red-50 text-red-900 border-red-200",
  }[type] || "bg-gray-50 text-gray-900 border-gray-200";

  return <div className={`rounded-md border px-4 py-3 text-sm ${color} ${className}`}>{children}</div>;
}
