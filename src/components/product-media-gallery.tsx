
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
  thumbnailUrl?: string; 
};

interface ProductMediaGalleryProps {
  product: Product;
}

export default function ProductMediaGallery({ product }: ProductMediaGalleryProps) {
  const [allMediaItems, setAllMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const getFallbackImageUrl = (name: string) => `https://placehold.co/600x600.png?text=${encodeURIComponent(name.substring(0,15))}`;

  useEffect(() => {
    const items: MediaItem[] = [];
    // Add main image
    const mainImageUrl = (typeof product.imageUrl === 'string' && (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')))
                         ? product.imageUrl
                         : getFallbackImageUrl(product.name + " main");
    items.push({ type: 'image', url: mainImageUrl, thumbnailUrl: mainImageUrl });

    // Add additional images
    if (product.additionalImageUrls) {
      product.additionalImageUrls.forEach((imgUrl, index) => {
        const additionalImageUrl = (typeof imgUrl === 'string' && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')))
                                   ? imgUrl
                                   : getFallbackImageUrl(product.name + ` add${index+1}`);
        items.push({ type: 'image', url: additionalImageUrl, thumbnailUrl: additionalImageUrl });
      });
    }

    // Add video
    if (product.videoUrl && (product.videoUrl.startsWith('data:video/') || product.videoUrl.startsWith('http'))) {
      // For thumbnail of video, we'll use a generic placeholder or the main product image if simple.
      // A more robust solution might involve generating video thumbnails.
      items.push({ type: 'video', url: product.videoUrl, thumbnailUrl: mainImageUrl }); 
    }
    
    setAllMediaItems(items);
    if (items.length > 0) {
      setSelectedMedia(items[0]); 
    }
  }, [product]);

  if (!selectedMedia) {
    return (
      <Card className="overflow-hidden rounded-lg shadow-md flex items-center justify-center aspect-square bg-muted">
        <ImageIcon className="w-24 h-24 text-muted-foreground" />
      </Card>
    );
  }

  const currentImageUrl = (typeof selectedMedia.url === 'string' && (selectedMedia.url.startsWith('http://') || selectedMedia.url.startsWith('https://')))
                          ? selectedMedia.url
                          : getFallbackImageUrl(product.name);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-lg shadow-md">
        {selectedMedia.type === 'image' ? (
          <div className="relative aspect-square">
            <Image
              src={currentImageUrl}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              priority 
              className="rounded-t-lg"
              data-ai-hint={currentImageUrl.includes('placehold.co') ? "placeholder image" : product.aiHint}
              onError={(e) => {
                const fallback = getFallbackImageUrl(product.name);
                if ((e.target as HTMLImageElement).src !== fallback) {
                  (e.target as HTMLImageElement).src = fallback;
                  (e.target as HTMLImageElement).srcset = "";
                }
              }}
            />
          </div>
        ) : (
          <div className="relative aspect-video bg-black rounded-t-lg">
            {selectedMedia.url.startsWith('data:video/') ? (
               <video
                controls
                src={selectedMedia.url}
                className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                aria-label={`${product.name} video`}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <iframe
                src={selectedMedia.url} // Assumes it's an embeddable URL like YouTube
                title={`${product.name} video`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-t-lg"
              ></iframe>
            )}
          </div>
        )}
      </Card>

      {allMediaItems.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
          {allMediaItems.map((item, index) => {
            const itemDisplayUrl = (typeof item.thumbnailUrl === 'string' && (item.thumbnailUrl.startsWith('http://') || item.thumbnailUrl.startsWith('https://')))
                                   ? item.thumbnailUrl
                                   : getFallbackImageUrl(product.name + ` thumb${index}`);
            return (
            <button
              key={index}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedMedia.url === item.url ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
              )}
              aria-label={`View ${item.type === 'image' ? `image ${index + 1}` : 'video'}`}
            >
              {item.type === 'image' || (item.type === 'video' && item.thumbnailUrl !== 'video_placeholder' && item.thumbnailUrl && (item.thumbnailUrl.startsWith('http') || item.thumbnailUrl.startsWith('data:image'))) ? (
                <Image
                  src={itemDisplayUrl}
                  alt={`${product.name} ${item.type} ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity hover:opacity-80"
                  onError={(e) => {
                    const fallbackThumb = getFallbackImageUrl(product.name + ` thumb${index} error`);
                     if ((e.target as HTMLImageElement).src !== fallbackThumb) {
                        (e.target as HTMLImageElement).src = fallbackThumb;
                        (e.target as HTMLImageElement).srcset = "";
                     }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <PlayCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              {item.type === 'video' && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
                    <PlayCircle className="w-6 h-6 text-white" />
                 </div>
              )}
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
}
