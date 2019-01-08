import GreetingService from "examples/GreetingServiceClass/GreetingService.js";
import ImportGreetingService from "examples/GreetingServiceClass/ImportGreetingService.js";
import { Microservices } from "../../src/services";

describe("Service Loaders suite", () => {
  describe("onStart Service Loaders", () => {
    it("Greeting.hello should greet Idan with hello", () => {

      const greetingService = Microservices
        .builder()
        .serviceLoaders(
          {
            loader: () => new Promise((resolve, reject) =>
              ImportGreetingService.then((GreetingService) => {
                resolve(new GreetingService.default());
              }).catch(e => reject(e))
            ),
            serviceClass: GreetingService
          })
        .build()
        .proxy()
        .api(GreetingService)
        .create();

      expect.assertions(1);
      return expect(greetingService.hello("Idan")).resolves.toEqual("Hello Idan");
    });
    it("Greeting should be loaded without calling it", () => {

      const mockFn = jest.fn(GreetingService => new GreetingService["default"]());
      Microservices
        .builder()
        .serviceLoaders(
          {
            loader: () => new Promise((resolve, reject) =>
              ImportGreetingService.then(GreetingService => resolve(mockFn(GreetingService)))["catch"](e => reject(e))
            ),
            serviceClass: GreetingService
          })
        .build()
        .proxy()
        .api(GreetingService)
        .create();

      expect.assertions(1);
      return ImportGreetingService.then(() => expect(mockFn.mock.calls.length).toBe(1));
    });
  });
  describe("onDemand Service Loaders", () => {
    it("Greeting.hello should greet Idan with hello", () => {
      const greetingService = Microservices
        .builder()
        .serviceLoaders(
          {
            loader: () => ({
              then: (func) => {
                ImportGreetingService
                  .then(GreetingService => func(new GreetingService["default"]()));
              }
            }),
            serviceClass: GreetingService
          })
        .build()
        .proxy()
        .api(GreetingService)
        .create();

      expect.assertions(1);
      return expect(greetingService.hello("Idan")).resolves.toEqual("Hello Idan");
    });
    it("Greeting should be loaded after calling it", (done) => {
      const mockFn = jest.fn(GreetingService => new GreetingService["default"]());
      const greetingService = Microservices
        .builder()
        .serviceLoaders(
          {
            loader: () => ({
              then: (func) => {
                ImportGreetingService
                  .then(GreetingService => func(mockFn(GreetingService)));
              }
            }),
            serviceClass: GreetingService
          })
        .build()
        .proxy()
        .api(GreetingService)
        .create();

      expect.assertions(2);
      setTimeout(()=>{
        expect(mockFn.mock.calls.length).toBe(0);
        greetingService.hello("Idan").then(()=>{
          expect(mockFn.mock.calls.length).toBe(1);
          done();
        });
      },1000);
    });
    it("Greeting.repeatToStream should return observable of greetings ", () => {
      const greetingService = Microservices
        .builder()
        .serviceLoaders(
          {
            loader: () => ({
              then: (func) => {
                ImportGreetingService
                  .then(GreetingService => func(new GreetingService["default"]()));
              }
            }),
            serviceClass: GreetingService
          })
        .build()
        .proxy()
        .api(GreetingService)
        .create();

      expect.assertions(3);
      let i = 0;
      greetingService.repeatToStream("Hello", "Hey", "Yo").subscribe((item) => {
        switch (i) {
        case 0:
          expect(item).toBe("Hello");
          break;
        case 1:
          expect(item).toBe("Hey");
          break;
        case 2:
          expect(item).toBe("Yo");
          break;
        default:
          expect(0).toBe(1);
          break;
        }
        i = i + 1;
      });

    });
  });
});
