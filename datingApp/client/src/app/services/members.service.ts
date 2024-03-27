import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Member } from '../models/member';
import { map, of } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { UserParams } from '../models/userParams';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];

  constructor(private http: HttpClient) { }

  getMembers(userParams: UserParams){
    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);

    return this.getPaginatedResult<Member[]>(this.baseUrl + "users",params)
  }



  getMember(username:string) {
    const member = this.members.find(x => x.username === username);
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + "users/" + username);
  }

  updateMember(member:Member) {
    return this.http.put<Member>(this.baseUrl + "users", member).pipe(
      map(()=> {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + "users/set-main-photo/"+ photoId, {});
  }

  deletePhoto(photoId: number){
    return this.http.delete(this.baseUrl + "users/delete-photo/" + photoId);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    return this.http.get<T[]>(url, { observe: 'response', params }).pipe(
      map(response => {
        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
        paginatedResult.result = response.body ? response.body : [];
        const paginationHeader = response.headers.get('Pagination');
        if (paginationHeader !== null) {
          paginatedResult.pagination = JSON.parse(paginationHeader);
        }
        return paginatedResult;
      })
    );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number){
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append("pageSize", pageSize.toString());

    return params;
  }
}
