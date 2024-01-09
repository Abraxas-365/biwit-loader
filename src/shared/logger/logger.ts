export class Logger {
  private log(level: string, message: string, error: any, event: any) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        system: event.headers["X-System"],
        trackId: event.headers["X-TrackId"],
        level: level,
        message: message,
        error: error,
      }),
    );
  }

  info(message: string, event: any, error?: any) {
    this.log("info", message, error, event);
  }

  warn(message: string, event: any, error?: any) {
    this.log("warn", message, error, event);
  }

  error(message: string, event: any, error?: any) {
    this.log("error", message, error, event);
  }

  debug(message: string, event: any, error?: any) {
    this.log("debug", message, error, event);
  }
}
