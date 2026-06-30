import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        speed?: number | string;
        loop?: boolean | string;
        autoplay?: boolean | string;
      };
    }
  }
}
