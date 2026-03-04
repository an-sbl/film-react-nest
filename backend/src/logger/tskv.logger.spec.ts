import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Должен выводить сообщение в TSKV формате', () => {
    logger.log('test', 'context');

    const output = consoleLogSpy.mock.calls[0][0];
    const parts = output.split('\t');

    expect(parts).toHaveLength(4);
    expect(parts[0]).toMatch(/^timestamp=.+/);
    expect(parts[1]).toBe('level=log');
    expect(parts[2]).toBe('context=context');
    expect(parts[3]).toBe('message=test');
  });

  it('log должен использовать console.log', () => {
    logger.log('log');
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain('level=log');
  });

  it('error должен использовать console.error', () => {
    logger.error('error');
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain('level=error');
  });

  it('warn должен использовать console.warn', () => {
    logger.warn('warn');
    expect(consoleWarnSpy).toHaveBeenCalled();
    expect(consoleWarnSpy.mock.calls[0][0]).toContain('level=warn');
  });

  it('debug должен использовать console.debug', () => {
    logger.debug('debug');
    expect(consoleDebugSpy).toHaveBeenCalled();
    expect(consoleDebugSpy.mock.calls[0][0]).toContain('level=debug');
  });

  it('verbose должен использовать console.log', () => {
    logger.verbose('verbose');
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain('level=verbose');
  });
});
