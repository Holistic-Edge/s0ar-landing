import { useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

export function CountryPicker({ label, value, countries, invalid, onChange }: { label: string; value: string; countries: string[]; invalid: boolean; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  function changeOpen(next: boolean) {
    const bottom = trigger.current?.getBoundingClientRect().bottom;
    if (next && bottom !== undefined) {
      const needed = Math.min(340, window.innerHeight * .5) - (window.innerHeight - bottom);
      if (needed > 0) window.scrollBy({top: needed, behavior: 'instant'});
    }
    setOpen(next);
  }
  return <Popover open={open} onOpenChange={changeOpen}>
    <PopoverTrigger asChild><Button ref={trigger} type="button" variant="outline" role="combobox" aria-label={label} aria-expanded={open} aria-invalid={invalid} className="country-trigger"><span className={value ? '' : 'text-muted-foreground'}>{value || 'Choose a country'}</span><ChevronDown aria-hidden="true" /></Button></PopoverTrigger>
    <PopoverContent align="start" side="bottom" sideOffset={6} avoidCollisions={false} className="country-menu">
      <Command><CommandInput placeholder={label === 'Country calling code' ? 'Search codes…' : 'Search countries…'} aria-label={`Search ${label.toLowerCase()}`} /><CommandList><CommandEmpty>No match found.</CommandEmpty><CommandGroup>{countries.map(country => <CommandItem value={country} key={country} onSelect={() => { onChange(country); setOpen(false); }}><span className="flex-1">{country}</span>{value === country && <Check />}</CommandItem>)}</CommandGroup></CommandList></Command>
    </PopoverContent>
  </Popover>;
}