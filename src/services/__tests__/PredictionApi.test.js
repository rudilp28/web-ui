import predictionApi from 'services/PredictionApi';
import { AuthExpiredInterceptor } from 'services/interceptors';
import { AXIOS_INSTANCE_FACTORY_IDENTIFIER } from 'services/factories';

describe('PredictionApi', () => {
  it('should have the axios factory unique identifier', () => {
    expect(predictionApi.axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(predictionApi.axiosInstance.interceptors.response.handlers).toMatchObject([
      interceptor,
    ]);
  });
});
