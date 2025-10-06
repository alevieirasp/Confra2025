export default function Checkbox({ className = "", label, id, ...rest }) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input
        id={id}
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-400 ${className}`}
        {...rest}
      />
      {label}
    </label>
  );
}
