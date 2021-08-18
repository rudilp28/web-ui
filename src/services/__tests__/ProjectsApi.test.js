import projectsApi from '../ProjectsApi';
import { AuthExpiredInterceptor } from '../interceptors';

describe('ProjectsApi', () => {
  it('should have the AuthExpired interceptor attached to the instance', () => {
    const interceptor = {
      fulfilled: AuthExpiredInterceptor.Response.onFulfilled,
      rejected: AuthExpiredInterceptor.Response.onRejected,
    };

    expect(projectsApi.axiosInstance.interceptors.response.handlers).toEqual([
      interceptor,
    ]);
  });
});
