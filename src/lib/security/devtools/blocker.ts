/**
 * 🚫 DEVTOOLS BLOCKER - Bloquea acceso a DevTools
 *
 * Bloquea shortcuts de teclado y acciones del mouse para prevenir
 * apertura de DevTools:
 * - F12, Ctrl+Shift+I/J/C, Cmd+Option+I/J/C
 * - Click derecho (contextmenu)
 * - Selección de texto (opcional)
 * - Copy/paste (opcional)
 *
 * @author Imagiq Security Team
 * @version 1.0.0
 */

export interface BlockerConfig {
  blockRightClick?: boolean; // Bloquear click derecho (default: true)
  blockTextSelection?: boolean; // Bloquear selección de texto (default: false)
  blockCopy?: boolean; // Bloquear Ctrl+C (default: false)
  blockPaste?: boolean; // Bloquear Ctrl+V (default: false)
  blockCut?: boolean; // Bloquear Ctrl+X (default: false)
  blockSave?: boolean; // Bloquear Ctrl+S (default: false)
  blockViewSource?: boolean; // Bloquear Ctrl+U (default: true)
  blockPrint?: boolean; // Bloquear Ctrl+P (default: false)
  showWarning?: boolean; // Mostrar advertencia al usuario (default: false)
  warningMessage?: string; // Mensaje de advertencia personalizado
  debug?: boolean; // Modo debug (logs)
}

const DEFAULT_WARNING = '⚠️ Esta acción está deshabilitada por seguridad.';

let isBlockerActive = false;
let currentConfig: Required<BlockerConfig>;

/**
 * Lista de shortcuts bloqueados para abrir DevTools
 */
const DEVTOOLS_SHORTCUTS = [
  { key: 'F12', ctrl: false, shift: false, alt: false, meta: false },
  { key: 'I', ctrl: true, shift: true, alt: false, meta: false }, // Ctrl+Shift+I
  { key: 'J', ctrl: true, shift: true, alt: false, meta: false }, // Ctrl+Shift+J
  { key: 'C', ctrl: true, shift: true, alt: false, meta: false }, // Ctrl+Shift+C
  { key: 'I', ctrl: false, shift: false, alt: true, meta: true }, // Cmd+Option+I (Mac)
  { key: 'J', ctrl: false, shift: false, alt: true, meta: true }, // Cmd+Option+J (Mac)
  { key: 'C', ctrl: false, shift: false, alt: true, meta: true }, // Cmd+Option+C (Mac)
  { key: 'U', ctrl: true, shift: false, alt: false, meta: false }, // Ctrl+U (view source)
  { key: 'U', ctrl: false, shift: false, alt: false, meta: true }, // Cmd+U (Mac view source)
];

/**
 * Verifica si un evento de teclado coincide con un shortcut bloqueado
 */
function isBlockedShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toUpperCase();
  const ctrl = event.ctrlKey;
  const shift = event.shiftKey;
  const alt = event.altKey;
  const meta = event.metaKey;

  return DEVTOOLS_SHORTCUTS.some(shortcut => {
    return (
      shortcut.key === key &&
      shortcut.ctrl === ctrl &&
      shortcut.shift === shift &&
      shortcut.alt === alt &&
      shortcut.meta === meta
    );
  });
}

/**
 * Handler de eventos de teclado
 */
function handleKeyDown(event: KeyboardEvent): void {
  // Bloquear shortcuts de DevTools
  if (isBlockedShortcut(event)) {
    event.preventDefault();
    event.stopPropagation();

    if (currentConfig.showWarning) {
      showWarningMessage(currentConfig.warningMessage);
    }

    return;
  }

  // Bloquear Ctrl+C (copy)
  if (currentConfig.blockCopy && (event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'C') {
    event.preventDefault();

    if (currentConfig.showWarning) {
      showWarningMessage('Copiar está deshabilitado.');
    }

    return;
  }

  // Bloquear Ctrl+V (paste)
  if (currentConfig.blockPaste && (event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'V') {
    event.preventDefault();
    return;
  }

  // Bloquear Ctrl+X (cut)
  if (currentConfig.blockCut && (event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'X') {
    event.preventDefault();
    return;
  }

  // Bloquear Ctrl+S (save)
  if (currentConfig.blockSave && (event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'S') {
    event.preventDefault();
    return;
  }

  // Bloquear Ctrl+P (print)
  if (currentConfig.blockPrint && (event.ctrlKey || event.metaKey) && event.key.toUpperCase() === 'P') {
    event.preventDefault();
    return;
  }
}

/**
 * Handler de click derecho
 */
function handleContextMenu(event: MouseEvent): void {
  if (currentConfig.blockRightClick) {
    event.preventDefault();

    if (currentConfig.showWarning) {
      showWarningMessage('Click derecho está deshabilitado.');
    }
  }
}

/**
 * Handler de selección de texto
 */
function handleSelectStart(event: Event): void {
  if (currentConfig.blockTextSelection) {
    event.preventDefault();
  }
}

/**
 * Handler de copy event
 */
function handleCopy(event: ClipboardEvent): void {
  if (currentConfig.blockCopy) {
    event.preventDefault();
  }
}

/**
 * Handler de paste event
 */
function handlePaste(event: ClipboardEvent): void {
  if (currentConfig.blockPaste) {
    event.preventDefault();
  }
}

/**
 * Handler de cut event
 */
function handleCut(event: ClipboardEvent): void {
  if (currentConfig.blockCut) {
    event.preventDefault();
  }
}

/**
 * Muestra mensaje de advertencia al usuario
 */
function showWarningMessage(message: string): void {
  // Usar toast notification si está disponible
  if (typeof window !== 'undefined') {
    const win = window as unknown as { toast?: { error: (msg: string) => void } };
    if (win.toast) {
      win.toast.error(message);
    }
  }
}

/**
 * Deshabilita drag & drop (puede usarse para extraer imágenes)
 */
function handleDragStart(event: DragEvent): void {
  event.preventDefault();
}

/**
 * Activa el bloqueador de DevTools
 */
export function enableDevToolsBlocking(config: BlockerConfig = {}): () => void {
  if (typeof window === 'undefined') {
    return () => { };
  }

  if (isBlockerActive) {
    return disableDevToolsBlocking;
  }

  // Configuración con defaults
  currentConfig = {
    blockRightClick: config.blockRightClick ?? true,
    blockTextSelection: config.blockTextSelection ?? false,
    blockCopy: config.blockCopy ?? false,
    blockPaste: config.blockPaste ?? false,
    blockCut: config.blockCut ?? false,
    blockSave: config.blockSave ?? false,
    blockViewSource: config.blockViewSource ?? true,
    blockPrint: config.blockPrint ?? false,
    showWarning: config.showWarning ?? false,
    warningMessage: config.warningMessage ?? DEFAULT_WARNING,
    debug: config.debug ?? false,
  };

  // Agregar event listeners
  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('contextmenu', handleContextMenu, true);
  document.addEventListener('selectstart', handleSelectStart, true);
  document.addEventListener('copy', handleCopy, true);
  document.addEventListener('paste', handlePaste, true);
  document.addEventListener('cut', handleCut, true);
  document.addEventListener('dragstart', handleDragStart, true);

  // Deshabilitar selección vía CSS si está configurado
  if (currentConfig.blockTextSelection) {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    (document.body.style as CSSStyleDeclaration & { msUserSelect?: string }).msUserSelect = 'none';
  }

  isBlockerActive = true;

  // Retornar función para desactivar
  return disableDevToolsBlocking;
}

/**
 * Desactiva el bloqueador de DevTools
 */
export function disableDevToolsBlocking(): void {
  if (!isBlockerActive) {
    return;
  }

  // Remover event listeners
  document.removeEventListener('keydown', handleKeyDown, true);
  document.removeEventListener('contextmenu', handleContextMenu, true);
  document.removeEventListener('selectstart', handleSelectStart, true);
  document.removeEventListener('copy', handleCopy, true);
  document.removeEventListener('paste', handlePaste, true);
  document.removeEventListener('cut', handleCut, true);
  document.removeEventListener('dragstart', handleDragStart, true);

  // Restaurar selección de texto
  if (currentConfig.blockTextSelection) {
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
    (document.body.style as CSSStyleDeclaration & { msUserSelect?: string }).msUserSelect = '';
  }

  isBlockerActive = false;
}

/**
 * Verifica si el bloqueador está activo
 */
export function isBlockerEnabled(): boolean {
  return isBlockerActive;
}

/**
 * Export por defecto
 */
export default {
  enableDevToolsBlocking,
  disableDevToolsBlocking,
  isBlockerEnabled,
};
