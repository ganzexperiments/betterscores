import React from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function DatePicker({ selectedDate, onDateChange }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const quickDates = [
    { label: 'Yesterday', date: subDays(new Date(), 1) },
    { label: 'Today', date: new Date() },
    { label: 'Tomorrow', date: addDays(new Date(), 1) },
  ];

  const handleDateClick = (date) => {
    onDateChange(date);
    setIsExpanded(false);
  };

  return (
    <div className="mb-10 flex flex-col items-center">
      <div className="flex flex-col items-center bg-[#12151c] border border-white/5 rounded-xl p-1 shadow-sm transition-all duration-300 hover:border-white/10 relative">
        <div className="flex items-center">
          {quickDates.map(({ label, date }) => {
            const isSelected = isSameDay(date, selectedDate);
            return (
              <button
                key={label}
                onClick={() => handleDateClick(date)}
                className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
          
          <div className="w-[1px] h-3 bg-white/10 mx-2" />
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isExpanded ? 'bg-white/10 text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Calendar size={14} />
          </button>
        </div>

        {isExpanded && (
          <div className="absolute top-full mt-2 z-50 grid grid-cols-7 gap-1 p-3 bg-[#12151c] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {Array.from({ length: 14 }).map((_, i) => {
              const date = addDays(subDays(new Date(), 7), i);
              const isSelected = isSameDay(date, selectedDate);
              
              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(date)}
                  className={`flex flex-col items-center justify-center w-10 h-12 rounded-lg transition-all ${
                    isSelected 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-white/5 text-slate-400'
                  }`}
                >
                  <span className="text-[9px] uppercase font-black opacity-40">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-sm font-bold leading-tight mt-0.5">
                    {format(date, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
