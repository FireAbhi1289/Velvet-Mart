
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
  // State for current main image URL to handle errors
  const [currentMainImageUrl, setCurrentMainImageUrl] = useState<string>('');

  const getFallbackImageUrl = (name: string, context: string = "") => `https://placehold.co/600x600.png?text=${encodeURIComponent(name.substring(0,10) + (context ? " " + context : "") || "Image")}`;

  useEffect(() => {
    const items: MediaItem[] = [];
    const mainImageFallback = getFallbackImageUrl(product.name, "main");
    const mainImageUrl = (typeof product.imageUrl === 'string' && (product.imageUrl.startsWith('http://') || product.imageUrl.startsWith('https://')))
                         ? product.imageUrl
                         : mainImageFallback;
    items.push({ type: 'image', url: mainImageUrl, thumbnailUrl: mainImageUrl });

    if (product.additionalImageUrls) {
      product.additionalImageUrls.forEach((imgUrl, index) => {
        const additionalImageFallback = getFallbackImageUrl(product.name, `add${index+1}`);
        const additionalImageUrl = (typeof imgUrl === 'string' && (imgUrl.startsWith('http://') || imgUrl.startsWith('https://')))
                                   ? imgUrl
                                   : additionalImageFallback;
        items.push({ type: 'image', url: additionalImageUrl, thumbnailUrl: additionalImageUrl });
      });
    }

    if (product.videoUrl && (product.videoUrl.startsWith('data:video/') || product.videoUrl.startsWith('http'))) {
      items.push({ type: 'video', url: product.videoUrl, thumbnailUrl: mainImageUrl }); 
    }
    
    setAllMediaItems(items);
    if (items.length > 0) {
      setSelectedMedia(items[0]); 
      setCurrentMainImageUrl(items[0].type === 'image' ? items[0].url : mainImageFallback);
    } else {
      setCurrentMainImageUrl(mainImageFallback); // Fallback if no media items
    }
  }, [product]);

  const handleMainImageError = () => {
    const fallback = getFallbackImageUrl(product.name, "error");
    if (currentMainImageUrl !== fallback) {
      setCurrentMainImageUrl(fallback);
    }
  };
  
  const handleThumbnailError = (index: number) => {
    const fallbackThumb = getFallbackImageUrl(product.name, `thumb${index} error`);
    setAllMediaItems(prevItems => {
        const newItems = [...prevItems];
        if (newItems[index] && newItems[index].thumbnailUrl !== fallbackThumb) {
            newItems[index] = { ...newItems[index], thumbnailUrl: fallbackThumb };
        }
        return newItems;
    });
  };


  useEffect(() => {
    if (selectedMedia?.type === 'image') {
      const fallback = getFallbackImageUrl(product.name, "selected");
      setCurrentMainImageUrl(
        (typeof selectedMedia.url === 'string' && (selectedMedia.url.startsWith('http://') || selectedMedia.url.startsWith('https://')))
        ? selectedMedia.url
        : fallback
      );
    }
  }, [selectedMedia, product.name]);


  if (!selectedMedia && allMediaItems.length === 0) {
    return (
      <Card className="overflow-hidden rounded-lg shadow-md flex items-center justify-center aspect-square bg-muted">
        <Image
            src={getFallbackImageUrl(product.name, "gallery")}
            alt={product.name}
            layout="fill"
            objectFit="contain"
            priority 
            className="rounded-t-lg"
            data-ai-hint="placeholder image"
          />
      </Card>
    );
  }


  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-lg shadow-md">
        {selectedMedia?.type === 'image' ? (
          <div className="relative aspect-square">
            <Image
              src={currentMainImageUrl}
              alt={product.name}
              layout="fill"
              objectFit="contain"
              priority 
              className="rounded-t-lg"
              data-ai-hint={currentMainImageUrl.includes('placehold.co') ? "placeholder image" : (product.aiHint || "product image")}
              onError={handleMainImageError}
            />
          </div>
        ) : selectedMedia?.type === 'video' ? (
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
            ) : ( // Assumes http/https URL for video is embeddable or direct link
              <video
                controls
                src={selectedMedia.url}
                className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                aria-label={`${product.name} video`}
              >
                Your browser does not support the video tag. If this is an embed link (e.g. YouTube), it might require an iframe.
              </video>
            )}
          </div>
        ) : (
            <div className="relative aspect-square bg-muted flex items-center justify-center">
                 <Image
                    src={getFallbackImageUrl(product.name, "no selection")}
                    alt="No media selected"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-t-lg"
                 />
            </div>
        )}
      </Card>

      {allMediaItems.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
          {allMediaItems.map((item, index) => {
            const itemDisplayUrl = item.thumbnailUrl && (item.thumbnailUrl.startsWith('http://') || item.thumbnailUrl.startsWith('https://') || item.thumbnailUrl.startsWith('data:image'))
                                   ? item.thumbnailUrl
                                   : getFallbackImageUrl(product.name, `thumb${index}`);
            return (
            <button
              key={index}
              onClick={() => setSelectedMedia(item)}
              className={cn(
                "relative aspect-square rounded-md overflow-hidden border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedMedia?.url === item.url ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
              )}
              aria-label={`View ${item.type === 'image' ? `image ${index + 1}` : 'video'}`}
            >
              {item.type === 'image' || (item.type === 'video' && item.thumbnailUrl && (item.thumbnailUrl.startsWith('http') || item.thumbnailUrl.startsWith('data:image'))) ? (
                <Image
                  src={itemDisplayUrl}
                  alt={`${product.name} ${item.type} ${index + 1}`}
                  layout="fill"
                  objectFit="contain"
                  className="transition-opacity hover:opacity-80"
                  onError={() => handleThumbnailError(index)}
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
