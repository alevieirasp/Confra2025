export default function Label({ children, htmlFor, className = "", ...rest }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
      {...rest}
    >
      {children}
    </label>
  );
}
