import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Paginated } from '../models/api.model';
import { GenerateRequest, GenerateResult, GeneratedImage } from '../models/image.model';

@Injectable({ providedIn: 'root' })
export class ImageService {
  private http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/images`;

  generate(payload: GenerateRequest): Observable<ApiResponse<GenerateResult>> {
    return this.http.post<ApiResponse<GenerateResult>>(`${this.api}/generate`, payload);
  }

  history(opts: {
    page?: number;
    limit?: number;
    search?: string;
    favorites?: boolean;
  }): Observable<ApiResponse<Paginated<GeneratedImage>>> {
    let params = new HttpParams()
      .set('page', String(opts.page ?? 1))
      .set('limit', String(opts.limit ?? 12));
    if (opts.search) params = params.set('search', opts.search);
    if (opts.favorites) params = params.set('favorites', 'true');
    return this.http.get<ApiResponse<Paginated<GeneratedImage>>>(`${this.api}/history`, {
      params,
    });
  }

  toggleFavorite(id: string): Observable<ApiResponse<{ image: GeneratedImage }>> {
    return this.http.patch<ApiResponse<{ image: GeneratedImage }>>(
      `${this.api}/${id}/favorite`,
      {}
    );
  }

  remove(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.api}/${id}`);
  }
}
