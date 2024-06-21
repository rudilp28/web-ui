import {
  createAxiosInstance,
  AXIOS_INSTANCE_FACTORY_IDENTIFIER,
} from 'services/factories';
import { AuthExpiredInterceptor } from 'services/interceptors';

describe('AxiosInstance factory', () => {
  it('should set the default baseURL', () => {
    const customBaseURL = 'http://localhost:8080';
    const axiosInstance = createAxiosInstance({ baseURL: customBaseURL });
    expect(axiosInstance.defaults.baseURL).toBe(customBaseURL);
  });

  it('should have the axios factory unique identifier', () => {
    const axiosInstance = createAxiosInstance({ baseURL: '' });
    expect(axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should contains the auth expired interceptor attached', () => {
    const axiosInstance = createAxiosInstance({ baseURL: '' });
    expect(axiosInstance.interceptors.response.handlers).toMatchObject([
      {
        fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
        rejected: AuthExpiredInterceptor.Response.onRejected,
      },
    ]);
  });
});
