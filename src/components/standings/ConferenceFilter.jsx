import { Button } from '../ui/Button';

const MAJOR_CONFERENCES = [
  { name: 'AP Top 25', value: 'all' },
  { name: 'Big Ten', value: 'big10' },
  { name: 'ACC', value: 'acc' },
  { name: 'Big 12', value: 'big12' },
  { name: 'SEC', value: 'sec' },
  { name: 'Big East', value: 'bige' },
  { name: 'Pac-12', value: 'pac-12' },
  { name: 'American', value: 'American' },
  { name: 'Atlantic 10', value: 'atl10' },
  { name: 'Mountain West', value: 'mwest' },
  { name: 'West Coast', value: 'wcc' },
];

export const ConferenceFilter = ({ selectedConference, onConferenceChange }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-white/80 mb-3 uppercase tracking-wide">
        Conference
      </label>
      <div className="flex flex-wrap gap-2">
        {MAJOR_CONFERENCES.map((conf) => (
          <Button
            key={conf.value}
            variant={selectedConference === conf.value ? 'primary' : 'outline'}
            onClick={() => onConferenceChange(conf.value)}
            className="text-sm px-4 py-2 min-h-[40px]"
          >
            {conf.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
