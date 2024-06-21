import experimentsApi from 'services/ExperimentsApi';
import { AuthExpiredInterceptor } from 'services/interceptors';
import { AXIOS_INSTANCE_FACTORY_IDENTIFIER } from 'services/factories';

describe('ExperimentsApi', () => {
  it('should have the axios factory unique identifier', () => {
    expect(experimentsApi.axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(experimentsApi.axiosInstance.interceptors.response.handlers).toMatchObject(
      [interceptor]
    );
  });
});
