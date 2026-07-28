function Skeleton({ className = "" }) {
  return (
    <div>
      <div
        className={`animate-pulse bg-gray-200 rounded h-52 w-full ${className}`}
      />
      ;
      <div
        className={`animate-pulse bg-gray-200 rounded h-6 w-3/4 mt-3 ${className}`}
      />
      ;
      <div
        className={`animate-pulse bg-gray-200 rounded h-4 w-full mt-2 ${className}`}
      />
      ;
      <div
        className={`animate-pulse bg-gray-200 rounded h-4 w-1/2 mt-2 ${className}`}
      />
      ;
    </div>
  );
}

export default Skeleton;
