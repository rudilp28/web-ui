import marketplaceApi from 'services/MarketplaceApi';
import { AuthExpiredInterceptor } from 'services/interceptors';
import { AXIOS_INSTANCE_FACTORY_IDENTIFIER } from 'services/factories';

describe('MarketplaceApi', () => {
  it('should have the axios factory unique identifier', () => {
    expect(marketplaceApi.axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(marketplaceApi.axiosInstance.interceptors.response.handlers).toMatchObject(
      [interceptor]
    );
  });
});
