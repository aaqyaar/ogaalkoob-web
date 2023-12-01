"use client";
import axios, {
  AxiosResponse,
  AxiosRequestHeaders,
  AxiosInstance,
} from "axios";
import { getGeneralApiProblem } from "./api.problem";
import { load } from "@/lib/storage";
import { ILoginResponse } from "@/types/auth";
// import { ApiProblem } from "./api.types";

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: `${process.env["NEXT_PUBLIC_APP_DOMAIN"]}/api`,
      timeout: 70000,
    });

    this.instance.defaults.headers.common["Content-Type"] = "application/json";

    // Add authorization token if needed
    const store = load("authStore") as {
      state: ILoginResponse;
    };
    this.instance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${store?.state?.token}`;

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (err: Error) => {
        const error = err as Error;
        return Promise.reject(error);
      }
    );
  }

  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    headers?: AxiosRequestHeaders
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.request({
        method,
        url: endpoint,
        data,
        headers,
      });

      return response.data;
    } catch (err) {
      const error = err as Error;
      console.log(error);
      if (axios.isAxiosError(error)) {
        throw getGeneralApiProblem(
          error.response?.status || 500,
          error.response?.data.hasOwnProperty("message") &&
            error.response?.data.message
        );
      } else {
        throw getGeneralApiProblem(500, error.message);
      }
    }
  }

  public get<T>(endpoint: string, headers?: AxiosRequestHeaders): Promise<T> {
    return this.request("GET", endpoint, undefined, headers);
  }

  public post<T>(
    endpoint: string,
    data?: any,
    headers?: AxiosRequestHeaders
  ): Promise<T> {
    return this.request("POST", endpoint, data, headers);
  }

  public put<T>(
    endpoint: string,
    data?: any,
    headers?: AxiosRequestHeaders
  ): Promise<T> {
    return this.request("PUT", endpoint, data, headers);
  }

  public delete<T>(
    endpoint: string,
    headers?: AxiosRequestHeaders
  ): Promise<T> {
    return this.request("DELETE", endpoint, undefined, headers);
  }
}

export default new ApiService();
