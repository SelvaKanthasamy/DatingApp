import { User } from 'src/app/_models/user';
import { AccountService } from './account.service';
import { UserParams } from './../_models/userParams';
import { PaginatedResult } from './../_models/pagination';
import { map, take } from 'rxjs/operators';
import { Member } from './../_models/member';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, pipe } from 'rxjs';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  memberCache = new Map();
  user: User;
  userParams: UserParams;

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$.pipe(take(1)).subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    })
   }

   getUserParams(){
     return this.userParams;
   }

   setUserParams(params: UserParams){
     this.userParams = params;
   }

   resetUserParams(){
     this.userParams = new UserParams(this.user);
     return this.userParams;
   }

  // getMembers(){
  //   if(this.members.length > 0 ) return of(this.members)
  //   return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
  //     map(members => {
  //       this.members = members;
  //       return members;
  //     })
  //   )
  // }

  getMembers(userParams: UserParams ){  

    var response = this.memberCache.get(Object.values(userParams).join('-'));

    if(response)
      return of(response);
    
    let params = getPaginationHeaders(userParams.pageNumber,userParams.pageSize);
    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);
    return getPaginatedResult<Member[]>(this.baseUrl + 'users', params,this.http)
      .pipe(map(response => {
        this.memberCache.set(Object.values(userParams).join('-'),response);
        return response;
      } ))

  }

  

  setMainPhoto(photoId: number){
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }

  deletePhoto(photoId : number){
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId)
  }

  addLike(username: string){
    return this.http.post(this.baseUrl +'likes/'+ username, {} )
  }

  getLikes(predicate: string, pageNumber, pageSize){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params = params.append('predicate', predicate);
    return getPaginatedResult<Member[]>(this.baseUrl + 'likes',params, this.http);
  }

  

  getMember(username: string){
    // const member = this.members.find(i => i.username === username);
    // if(member !== undefined) return of(member)

    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result),[])
      .find((member: Member) => member.username === username);
    
      if(member){
        return of(member);
      }

    return this.http.get<Member>(this.baseUrl + 'users/' + username)
  }

  updateMembers(member: Member){
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
