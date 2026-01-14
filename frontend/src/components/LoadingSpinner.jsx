const LoadingSpinner = ({ size = 'default', text = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    default: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`spinner ${sizeClasses[size]}`} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
