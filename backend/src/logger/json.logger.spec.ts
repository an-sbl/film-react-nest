import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('log должен выводить сообщение в JSON формате', () => {
    logger.log('test', 'context');

    const output = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed).toEqual({
      level: 'log',
      message: 'test',
      optionalParams: ['context'],
    });
  });

  it('error должен выводить сообщение в JSON формате', () => {
    logger.error('error', 'context');

    const output = consoleErrorSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed).toEqual({
      level: 'error',
      message: 'error',
      optionalParams: ['context'],
    });
  });

  it('warn должен выводить сообщение в JSON формате', () => {
    logger.warn('warn', 'context');

    const output = consoleWarnSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed).toEqual({
      level: 'warn',
      message: 'warn',
      optionalParams: ['context'],
    });
  });

  it('debug должен выводить сообщение в JSON формате', () => {
    logger.debug('debug', 'context');

    const output = consoleDebugSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed).toEqual({
      level: 'debug',
      message: 'debug',
      optionalParams: ['context'],
    });
  });

  it('verbose должен выводить сообщение в JSON формате', () => {
    logger.verbose('verbose', 'context');

    const output = consoleLogSpy.mock.calls[0][0];
    const parsed = JSON.parse(output);

    expect(parsed).toEqual({
      level: 'verbose',
      message: 'verbose',
      optionalParams: ['context'],
    });
  });
});
