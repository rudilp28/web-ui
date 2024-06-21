import { AuthExpiredInterceptor } from 'services/interceptors';
import deploymentsOperatorsApi from 'services/DeploymentsOperatorsApi';
import { AXIOS_INSTANCE_FACTORY_IDENTIFIER } from 'services/factories';

describe('DeploymentsOperatorsApi', () => {
  it('should have the axios factory unique identifier', () => {
    expect(deploymentsOperatorsApi.axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(
      deploymentsOperatorsApi.axiosInstance.interceptors.response.handlers
    ).toMatchObject([interceptor]);
  });
});
