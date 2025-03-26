import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPost } from './interfaces/post.interface';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly _http: HttpClient = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000';

  public getPosts(): Observable<Array<IPost>> {
    return this._http.get<Array<IPost>>(`${this.BASE_URL}/posts`);
  }

  public updatePost(postId: string, likeCount: number): Observable<IPost> {
    return this._http.patch<IPost>(`${this.BASE_URL}/posts/${postId}`, {likeCount: likeCount});
  }
}
