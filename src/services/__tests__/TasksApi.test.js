import tasksApi from 'services/TasksApi';
import { AuthExpiredInterceptor } from 'services/interceptors';
import { AXIOS_INSTANCE_FACTORY_IDENTIFIER } from 'services/factories';

describe('TasksApi', () => {
  it('should have the axios factory unique identifier', () => {
    expect(tasksApi.axiosInstance.factoryIdentifier).toBe(
      AXIOS_INSTANCE_FACTORY_IDENTIFIER
    );
  });

  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(tasksApi.axiosInstance.interceptors.response.handlers).toMatchObject([
      interceptor,
    ]);
  });
});
