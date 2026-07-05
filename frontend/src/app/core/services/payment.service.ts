import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated } from '../models/api.model';
import {
  CreditPackage,
  OrderResult,
  Transaction,
} from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/payments`;

  packages(): Observable<ApiResponse<{ packages: CreditPackage[] }>> {
    return this.http.get<ApiResponse<{ packages: CreditPackage[] }>>(`${this.api}/packages`);
  }

  createOrder(packageId: string): Observable<ApiResponse<OrderResult>> {
    return this.http.post<ApiResponse<OrderResult>>(`${this.api}/order`, { packageId });
  }

  verify(payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Observable<ApiResponse<{ credits: number }>> {
    return this.http.post<ApiResponse<{ credits: number }>>(`${this.api}/verify`, payload);
  }

  transactions(page = 1, limit = 10): Observable<ApiResponse<Paginated<Transaction>>> {
    const params = new HttpParams().set('page', String(page)).set('limit', String(limit));
    return this.http.get<ApiResponse<Paginated<Transaction>>>(`${this.api}/transactions`, {
      params,
    });
  }
}
