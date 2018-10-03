import { RSocketClientProvider } from '../../src/provider/RSocketClientProvider';
import { Transport } from '../../src/Transport';
import { errors } from '../../src/errors';
import { getTextResponseMany } from '../../src/utils';
import { socketURI as URI } from '../utils';
import { startServer, stopServer } from '../../src/server/server';

describe('Tests specifically for Rsocket provider', () => {
  let transport;
  let needToRemoveProvider = true;
  const text = 'Test text';

  const prepareTransport = async () => {
    transport = new Transport();
    await transport.setProvider(RSocketClientProvider, { URI });
    return transport;
  };

  beforeAll(() => {
    startServer();
  });

  afterAll(() => {
    stopServer();
  });

  afterEach(async () => {
    if (needToRemoveProvider) {
      await transport.removeProvider();
    }
    transport = undefined;
    needToRemoveProvider = true;
  });

  it('Providing an url with inactive websocket server causes an error while setting a provider', async (done) => {
    expect.assertions(1);

    transport = new Transport();
    transport.setProvider(RSocketClientProvider, { URI: 'ws://localhost:9999' }).catch((error) => {
      expect(error).toEqual(new Error(errors.noConnection));
      needToRemoveProvider = false;
      done();
    });
  });

  it('If keepAlive is not a number, there is a validation error', async (done) => {
    expect.assertions(1);

    transport = new Transport();
    transport.setProvider(RSocketClientProvider, { URI, keepAlive: 'test' }).catch((error) => {
      expect(error).toEqual(new Error(errors.wrongKeepAlive));
      needToRemoveProvider = false;
      done();
    });
  });

  it('If lifetime is not a number, there is a validation error', async (done) => {
    expect.assertions(1);

    transport = new Transport();
    transport.setProvider(RSocketClientProvider, { URI, lifetime: 'test' }).catch((error) => {
      expect(error).toEqual(new Error(errors.wrongLifetime));
      needToRemoveProvider = false;
      done();
    });
  });

  it('If WebSocket is not a function, there is a validation error', async (done) => {
    expect.assertions(1);

    transport = new Transport();
    transport.setProvider(RSocketClientProvider, { URI, WebSocket: 'test' }).catch((error) => {
      expect(error).toEqual(new Error(errors.wrongWebSocket));
      needToRemoveProvider = false;
      done();
    });
  });

  it('Use requestResponse type with "many" action - receive one response and the stream is completed', async (done) => {
    expect.assertions(1);

    const transport = await prepareTransport();
    const stream = transport.request({ headers: { type: 'requestResponse' }, data: text, entrypoint: '/greeting/many' });
    stream.subscribe(
      (data) => {
        expect(data).toEqual(getTextResponseMany(0)(text));
      },
      undefined,
      done
    );
  });

  it('Request "type" validation error', async (done) => {
    expect.assertions(1);
    const transport = await prepareTransport();
    const stream = transport.request({ headers: { type: 'wrongType' }, data: text, entrypoint: '/greeting/many' });
    stream.subscribe(
      (data) => {},
      (error) => {
        expect(error).toEqual(new Error(errors.wrongType));
        setTimeout(() => {
          done();
        }, 100);
      }
    );
  });

});