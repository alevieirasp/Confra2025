export default function Select({ className = "", children, ...rest }) {
  return (
    <select
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
}
