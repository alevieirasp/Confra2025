export default function Dialog({ open, onClose, title, children, className = "" }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-lg ${className}`}
      >
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            {title}
          </h2>
        )}
        <div className="text-sm text-gray-700">{children}</div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
