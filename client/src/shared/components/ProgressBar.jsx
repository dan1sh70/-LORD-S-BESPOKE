import React from 'react';

const ProgressBar = ({ progress }) => {
  const isComplete = progress === 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
      <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
        <div 
          className={`h-full transition-all duration-500 ease-out ${isComplete ? 'bg-green-500' : 'bg-primary-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-right text-xs font-semibold text-slate-700 mt-1">
        {progress}% Completed
      </p>
    </div>
  );
};

export default ProgressBar;
