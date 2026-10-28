import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import photo23 from '@/assets/soar-lifestyle-23.webp.asset.json';
import photo24 from '@/assets/soar-lifestyle-24.webp.asset.json';
import photo25 from '@/assets/soar-lifestyle-25.webp.asset.json';
import photo26 from '@/assets/soar-lifestyle-26.webp.asset.json';
import thumb23 from '@/assets/soar-lifestyle-23-thumb.webp.asset.json';
import thumb24 from '@/assets/soar-lifestyle-24-thumb.webp.asset.json';
import thumb25 from '@/assets/soar-lifestyle-25-thumb.webp.asset.json';
import thumb26 from '@/assets/soar-lifestyle-26-thumb.webp.asset.json';

const PHOTOS = [
  { image: photo23.url, thumbnail: thumb23.url, alt: 'Guests watching the ocean sunset from the sheltered SOAR deck' },
  { image: photo24.url, thumbnail: thumb24.url, alt: 'Friends sharing drinks beside the sea at sunset' },
  { image: photo25.url, thumbnail: thumb25.url, alt: 'Friends raising a toast together on board after dark' },
  { image: photo26.url, thumbnail: thumb26.url, alt: 'SOAR Ocean Club illuminated at night, seen from above' },
];

export function LifestyleGallery() {
  const [active, setActive] = useState<number | null>(null);
  const touchStart = useRef<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const photo = active === null ? undefined : PHOTOS[active];
  function move(direction: number) {
    setActive(current => current === null ? null : (current + direction + PHOTOS.length) % PHOTOS.length);
  }

  return <div className="lifestyle-gallery">
    <p className="eyebrow">A glimpse of life on board.</p>
    <div className="lifestyle-thumbnails">
      {PHOTOS.map((item, index) => <Button key={item.image} type="button" variant="ghost" className="lifestyle-thumbnail" aria-label={`View lifestyle photo ${index + 1}: ${item.alt}`} onClick={event => {opener.current = event.currentTarget; setActive(index);}}>
        <img src={item.thumbnail} alt={item.alt} loading="lazy" width={480} height={320}/>
      </Button>)}
    </div>
    <Dialog open={active !== null} onOpenChange={open => { if (!open) setActive(null); }}>
      <DialogContent className="lifestyle-lightbox" onCloseAutoFocus={event => {event.preventDefault(); opener.current?.focus({preventScroll: true});}} onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          move(event.key === 'ArrowRight' ? 1 : -1);
        }
      }}>
        <DialogTitle className="sr-only">SOAR life on board</DialogTitle>
        <DialogDescription className="sr-only">{photo?.alt}</DialogDescription>
        {photo && <div className="lightbox-image" onTouchStart={event => {touchStart.current = event.touches[0]?.clientX ?? null;}} onTouchEnd={event => {
          const end = event.changedTouches[0]?.clientX;
          if (touchStart.current !== null && end !== undefined && Math.abs(end - touchStart.current) > 50) move(end < touchStart.current ? 1 : -1);
          touchStart.current = null;
        }}>
          <img src={photo.image} alt={photo.alt}/>
        </div>}
        <div className="lightbox-controls">
          <Button variant="ghost" size="icon" type="button" aria-label="Previous photo" title="Previous photo" onClick={() => move(-1)}><ArrowLeft/></Button>
          <span aria-live="polite">{active === null ? 0 : active + 1} / {PHOTOS.length}</span>
          <Button variant="ghost" size="icon" type="button" aria-label="Next photo" title="Next photo" onClick={() => move(1)}><ArrowRight/></Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>;
}