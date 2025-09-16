declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      ar?: boolean;
      'ar-modes'?: string;
      'camera-controls'?: boolean;
      'tone-mapping'?: string;
      poster?: string;
      'shadow-intensity'?: string | number;
      reveal?: string;
      slot?: string;
      id?: string;
      // Permite otros atributos personalizados (sin usar `any`)
      [key: `data-${string}`]: string | number | boolean | undefined;
    };
  }
}
