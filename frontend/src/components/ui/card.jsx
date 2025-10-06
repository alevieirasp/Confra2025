export default function Card({ className = "", children }) {
  return <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}
