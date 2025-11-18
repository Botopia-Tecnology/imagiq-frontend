/**
 * 🔍 DEVTOOLS DETECTOR - Detecta apertura de DevTools
 *
 * Implementa múltiples técnicas para detectar cuando el usuario abre DevTools:
 * - Debugger statement timing
 * - Console.log override detection
 * - Window size diff detection
 * - Performance timing anomalies
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

export interface DevToolsDetectorConfig {
  interval?: number; // Intervalo de polling en ms (default: 1000)
  onDetected?: () => void; // Callback cuando se detecta
  onClosed?: () => void; // Callback cuando se cierra
  debug?: boolean; // Modo debug (logs)
}

export interface DevToolsState {
  isOpen: boolean;
  detectionMethod: string | null;
  timestamp: number | null;
}

let detectorInterval: number | null = null;
let currentState: DevToolsState = {
  isOpen: false,
  detectionMethod: null,
  timestamp: null,
};

/**
 * Técnica 1: Debugger Statement Timing
 * Mide cuánto tarda en ejecutarse un debugger statement
 * DESACTIVADA: Genera muchos falsos positivos
 */
function detectViaDebuggerTiming(): boolean {
  // Desactivado para evitar falsos positivos
  return false;

  /* Código original desactivado:
  const start = performance.now();
  // eslint-disable-next-line no-debugger
  debugger;
  const end = performance.now();
  const duration = end - start;
  return duration > 100;
  */
}

/**
 * Técnica 2: Console Detection
 * Override console.log para detectar cuándo se accede
 * DESACTIVADA: Genera falsos positivos en Chrome/Edge
 */
function detectViaConsole(): boolean {
  // Desactivado para evitar falsos positivos
  return false;

  /* Código original desactivado:
  let detected = false;
  try {
    const element = new Image();
    Object.defineProperty(element, 'id', {
      get: function () {
        detected = true;
        return 'detected';
      },
    });
    console.log(element);
    console.clear();
  } catch {
    // Ignore errors
  }
  return detected;
  */
}

/**
 * Técnica 3: Window Size Detection (MEJORADA)
 * Detecta diferencia entre tamaño de window y viewport
 * NUEVA LÓGICA: Solo detectar cuando DevTools ocupa espacio significativo
 */
function detectViaWindowSize(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    // Diferencia entre outer (ventana completa) e inner (viewport)
    const widthDiff = window.outerWidth - window.innerWidth;
    const heightDiff = window.outerHeight - window.innerHeight;

    // Dimensiones de la ventana
    const totalWidth = window.outerWidth;
    const totalHeight = window.outerHeight;

    // NUEVA LÓGICA: Detectar solo si DevTools ocupa >30% del espacio
    // Esto evita falsos positivos de zoom, scrollbars, etc.
    const widthRatio = widthDiff / totalWidth;
    const heightRatio = heightDiff / totalHeight;

    // DevTools docked abajo: heightDiff > 30% del alto total
    const dockedBottom = heightRatio > 0.3 && heightRatio < 0.8;

    // DevTools docked al lado: widthDiff > 30% del ancho total
    const dockedSide = widthRatio > 0.3 && widthRatio < 0.8;

    return dockedBottom || dockedSide;
  } catch {
    return false;
  }
}

/**
 * Técnica 4: toString Override Detection
 * Detecta cuando DevTools accede a métodos toString
 * DESACTIVADA: Genera falsos positivos
 */
function detectViaToString(): boolean {
  // Desactivado para evitar falsos positivos
  return false;

  /* Código original desactivado:
  let detected = false;
  try {
    const detector = /./;
    detector.toString = function () {
      detected = true;
      return 'detected';
    };
    console.log('%c', detector);
    console.clear();
  } catch {
    // Ignore errors
  }
  return detected;
  */
}

/**
 * Técnica 5: Firebug Check (legacy, pero funciona en algunos navegadores)
 */
function detectViaFirebug(): boolean {
  return !!(window as Window & { firebug?: unknown }).firebug;
}

/**
 * Técnica 6: Chrome DevTools Protocol
 * DESACTIVADA: __REACT_DEVTOOLS_GLOBAL_HOOK__ se inyecta por la extensión aunque DevTools esté cerrado
 */
function detectViaChromeProtocol(): boolean {
  // Desactivado para evitar falsos positivos
  return false;

  /* Código original desactivado:
  try {
    // Chrome expone __REACT_DEVTOOLS_GLOBAL_HOOK__ cuando DevTools está abierto
    return !!(window as Window & { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__;
  } catch {
    return false;
  }
  */
}

/**
 * Ejecuta todas las técnicas de detección
 * Retorna true si AL MENOS UNA detecta DevTools abierto
 */
function detectDevTools(debug = false): { detected: boolean; method: string | null } {
  const techniques = [
    { name: 'debugger-timing', fn: detectViaDebuggerTiming },
    { name: 'console', fn: detectViaConsole },
    { name: 'window-size', fn: detectViaWindowSize },
    { name: 'toString', fn: detectViaToString },
    { name: 'firebug', fn: detectViaFirebug },
    { name: 'chrome-protocol', fn: detectViaChromeProtocol },
  ];

  for (const technique of techniques) {
    try {
      const result = technique.fn();
      if (result) {
        return { detected: true, method: technique.name };
      }
    } catch (error) {
      // Ignore errors
    }
  }

  return { detected: false, method: null };
}

/**
 * Inicia la detección continua de DevTools
 */
export function startDevToolsDetection(config: DevToolsDetectorConfig = {}): () => void {
  const {
    interval = 1000,
    onDetected,
    onClosed,
    debug = false,
  } = config;

  // Si ya hay un detector corriendo, detenerlo
  if (detectorInterval !== null) {
    stopDevToolsDetection();
  }

  // Ejecutar primera vez inmediatamente
  checkDevToolsStatus(onDetected, onClosed, debug);

  // Luego cada intervalo
  detectorInterval = window.setInterval(() => {
    checkDevToolsStatus(onDetected, onClosed, debug);
  }, interval);

  // Retornar función para detener
  return stopDevToolsDetection;
}

/**
 * Verifica el estado de DevTools y dispara callbacks
 */
function checkDevToolsStatus(
  onDetected?: () => void,
  onClosed?: () => void,
  debug = false
): void {
  const { detected, method } = detectDevTools(debug);

  // Estado anterior
  const wasOpen = currentState.isOpen;

  // Actualizar estado actual
  if (detected && !wasOpen) {
    // DevTools se acaba de abrir
    currentState = {
      isOpen: true,
      detectionMethod: method,
      timestamp: Date.now(),
    };

    // Disparar callback
    onDetected?.();
  } else if (!detected && wasOpen) {
    // DevTools se acaba de cerrar
    currentState = {
      isOpen: false,
      detectionMethod: null,
      timestamp: Date.now(),
    };

    // Disparar callback
    onClosed?.();
  }
}

/**
 * Detiene la detección de DevTools
 */
export function stopDevToolsDetection(): void {
  if (detectorInterval !== null) {
    window.clearInterval(detectorInterval);
    detectorInterval = null;
  }
}

/**
 * Obtiene el estado actual de DevTools
 */
export function getDevToolsState(): DevToolsState {
  return { ...currentState };
}

/**
 * Verifica si DevTools está abierto actualmente (sin polling)
 */
export function isDevToolsOpen(): boolean {
  const { detected } = detectDevTools();
  return detected;
}

/**
 * Export por defecto
 */
export default {
  startDevToolsDetection,
  stopDevToolsDetection,
  getDevToolsState,
  isDevToolsOpen,
};
