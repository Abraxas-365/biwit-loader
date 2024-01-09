export class Logger {
  private log(level: string, message: string, error: any) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: level,
        message: message,
        error: error,
      }),
    );
  }

  info(message: string, error?: any) {
    this.log("info", message, error);
  }

  warn(message: string, error?: any) {
    this.log("warn", message, error);
  }

  error(message: string, error?: any) {
    this.log("error", message, error);
  }

  debug(message: string, error?: any) {
    this.log("debug", message, error);
  }
}
