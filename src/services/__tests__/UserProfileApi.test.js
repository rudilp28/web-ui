import UserProfileApi from 'services/UserProfileApi';
import { AuthExpiredInterceptor } from 'services/interceptors';
import { AXIOS_INSTANCE_FACTORY_IDENTIFIER } from 'services/factories';

describe('UserProfileApi', () => {
  it('should have the axios factory unique identifier', () => {
    expect(UserProfileApi.axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(UserProfileApi.axiosInstance.interceptors.response.handlers).toMatchObject(
      [interceptor]
    );
  });
});
