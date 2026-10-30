import { useState } from 'react';
import { format, parseISO, startOfToday } from 'date-fns';
import { CalendarDays, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function SoarDatePicker({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
 const [open, setOpen] = useState(false);
 const selected = value ? parseISO(value) : undefined;
 return <div className="soar-date">
  <Popover open={open} onOpenChange={setOpen}>
   <PopoverTrigger asChild>
    <Button type="button" variant="outline" aria-label={label} className="country-trigger soar-date-trigger">
     <span className={selected ? '' : 'soar-date-placeholder'}>{selected ? format(selected, 'EEEE, d MMMM yyyy') : 'Choose a date'}</span>
     <CalendarDays aria-hidden="true"/>
    </Button>
   </PopoverTrigger>
   <PopoverContent side="top" align="start" sideOffset={8} collisionPadding={16} className="soar-calendar-popover">
    <Calendar mode="single" selected={selected} defaultMonth={selected ?? startOfToday()} disabled={{ before: startOfToday() }} weekStartsOn={1}
     onSelect={date => { onChange(date ? format(date, 'yyyy-MM-dd') : ''); setOpen(false); }}
     className="soar-calendar pointer-events-auto"/>
   </PopoverContent>
  </Popover>
  {selected && <button type="button" className="soar-date-clear" aria-label="Clear experience date" onClick={() => onChange('')}><X aria-hidden="true"/></button>}
 </div>;
}
