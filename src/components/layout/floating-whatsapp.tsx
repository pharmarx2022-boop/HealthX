
'use client';

import Link from 'next/link';
import { MessageCircle } from 'lucide-react'; // Or a specific WhatsApp icon if you have one

export function FloatingWhatsApp() {
  return (
    <Link 
      href="#"
      // In a real app, this would be: href="https://wa.me/YOUR_PHONE_NUMBER"
      // target="_blank"
      // rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-110"
      title="Contact us on WhatsApp"
    >
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
        >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.81L2 22l5.29-1.38c1.37.71 2.93 1.11 4.59 1.11 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"></path>
            <path d="M16.92 14.37c-.14-.07-.84-.42-.97-.47-.13-.05-.23-.07-.33.07-.1.14-.37.47-.45.57-.08.1-.17.11-.3.05-.14-.07-1.46-.54-2.78-1.72-1.03-.92-1.73-2.05-2.02-2.39-.3-.34-.03-.52.04-.57.07-.05.14-.14.22-.22.08-.08.1-.14.17-.24.07-.1.03-.17-.02-.24-.05-.07-.33-.8-.45-1.1-.12-.3-.24-.26-.33-.26h-.3c-.1 0-.24.03-.37.14-.13.11-.5.48-.5.58 0 .1.03.14.07.17l.03.03c.53.47 1.02 1.14 1.48 1.83.47.7 1.13 1.52 2.39 2.11.3.14.56.22.84.28.3.06.84.05 1.12-.08.3-.14.84-.95.95-1.12.11-.17.11-.3.08-.37z"></path>
        </svg>
      <span className="sr-only">WhatsApp</span>
    </Link>
  );
}
