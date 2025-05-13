'use client';

import type { Product } from '@/lib/data';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PlayCircle, Image as ImageIcon } from 'lucide-react';

type MediaItem = {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string; // For video, this could be a specific thumbnail image
};

interface ProductMediaGalleryProps {
  product: Product;
}

export default function ProductMediaGallery({ product }: ProductMediaGalleryProps) {
  const [allMediaItems, setAllMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const items: MediaItem[] = [];
    // Add main image
    items.push({ type: 'image', url: product.imageUrl, thumbnailUrl: product.imageUrl });

    // Add additional images
    if (product.additionalImageUrls) {
      product.additionalImageUrls.forEach(imgUrl => {
        items.push({ type: 'image', url: imgUrl, thumbnailUrl: imgUrl });
      });
    }

    // Add video
    if (product.videoUrl) {
      items.push({ type: 'video', url: product.videoUrl, thumbnailUrl: 'video_placeholder' }); // Placeholder, could use a generic video icon
    }
    
    setAllMediaItems(items);
    if (items.length > 0) {
      setSelectedMedia(items[0]); // Select the main image by default
    }
  }, [product]);

  if (!selectedMedia) {
    return (
      <Card className="overflow-hidden rounded-lg shadow-md flex items-center justify-center aspect-square">
        <ImageIcon className="w-24 h-24 text-muted-foreground" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-lg shadow-md">
        {selectedMedia.type === 'image' ? (
          <div className="relative aspect-square">
            <Image
              src={selectedMedia.url}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              priority // Prioritize loading the main product image
              className="rounded-t-lg"
              data-ai-hint={product.aiHint} // Main image AI hint
            />
          </div>
        ) : (
          <div className="relative aspect-video">
            <iframe
              src={selectedMedia.url}
              title={`${product.name} video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-t-lg"
            ></iframe>
          </div>
        )}
      </Card>

      {allMediaItems.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
          {allMediaItems.map((item, index) => (
            <button
              key={index}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedMedia.url === item.url ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
              )}
              aria-label={`View ${item.type === 'image' ? `image ${index + 1}` : 'video'}`}
            >
              {item.type === 'image' || (item.type === 'video' && item.thumbnailUrl !== 'video_placeholder') ? (
                <Image
                  src={item.thumbnailUrl!}
                  alt={`${product.name} ${item.type} ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity hover:opacity-80"
                />
              ) : (
                // Video placeholder thumbnail
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              {item.type === 'video' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <PlayCircle className="w-6 h-6 text-white" />
                 </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
