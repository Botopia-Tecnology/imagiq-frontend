/**
 * Logger centralizado para la aplicación
 * En producción, los logs se pueden enviar a un servicio externo (Sentry, LogRocket, etc.)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabledInProduction: boolean;
  minLevel: LogLevel;
}

const config: LoggerConfig = {
  enabledInProduction: false,
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
};

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production' && !config.enabledInProduction) {
      return level === 'error'; // Solo errores en producción
    }
    return levels[level] >= levels[config.minLevel];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      // eslint-disable-next-line no-console
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      // eslint-disable-next-line no-console
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: unknown, ...args: unknown[]): void {
    if (this.shouldLog('error')) {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, error, ...args);

      // En producción, aquí se podría enviar a Sentry, LogRocket, etc.
      if (process.env.NODE_ENV === 'production' && error instanceof Error) {
        // TODO: Integrar con servicio de monitoreo
        // Sentry.captureException(error);
      }
    }
  }
}

export const logger = new Logger();
