import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';

export const DatePicker = ({ selectedDate, onDateChange }) => {
  const today = new Date();
  
  // Generate dates: 14 days back, 14 days forward (29 total)
  const dates = [];
  for (let i = -14; i <= 14; i++) {
    dates.push(addDays(today, i));
  }

  const scrollToDate = (date) => {
    onDateChange(date);
  };

  const handlePrev = () => {
    const currentIndex = dates.findIndex(d => isSameDay(d, selectedDate));
    if (currentIndex > 0) {
      scrollToDate(dates[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    const currentIndex = dates.findIndex(d => isSameDay(d, selectedDate));
    if (currentIndex < dates.length - 1) {
      scrollToDate(dates[currentIndex + 1]);
    }
  };

  return (
    <div className="bg-[#12151c] rounded-lg border border-white/10 p-3 mb-8">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 justify-center">
            {dates.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, today);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => scrollToDate(date)}
                  className={`
                    relative flex flex-col items-center 
                    py-2 px-3
                    rounded-lg 
                    min-w-[52px]
                    transition-colors duration-200
                    ${isSelected
                      ? 'bg-blue-500 text-white'
                      : isToday
                        ? 'bg-white/5 text-white ring-1 ring-blue-500/30'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <span className="text-xs font-medium opacity-60 uppercase">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-2xl font-semibold">
                    {format(date, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
