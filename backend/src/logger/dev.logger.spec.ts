import { DevLogger } from './dev.logger';

describe('DevLogger', () => {
  it('должен быть экземпляром ConsoleLogger', () => {
    const logger = new DevLogger();
    expect(logger).toBeInstanceOf(DevLogger);
  });

  it('должен иметь все необходимые методы', () => {
    const logger = new DevLogger();

    expect(logger.log).toBeDefined();
    expect(logger.error).toBeDefined();
    expect(logger.warn).toBeDefined();
    expect(logger.debug).toBeDefined();
    expect(logger.verbose).toBeDefined();
  });
});
