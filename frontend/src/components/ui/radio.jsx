export default function Radio({ className = "", name, value, label, id, ...rest }) {
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        className={`h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-400 ${className}`}
        {...rest}
      />
      {label}
    </label>
  );
}
