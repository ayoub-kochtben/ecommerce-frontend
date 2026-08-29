import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserStorageService } from '../storage/user-storage';

const BASIC_URL = "https://ecommerce-backend-production-b251.up.railway.app/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private userStorageService: UserStorageService
  ) { }

  register(signupRequest: any): Observable<any> {
    return this.http.post(BASIC_URL + "sign-up", signupRequest);
  }

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { username, password };

    return this.http.post(BASIC_URL + 'authenticate', body, { headers, observe: 'response' }).pipe(
     //Il contient ici deux options.
    // headers:Angular envoie:Content-Type: application/json
    //Angular peut récupérer seulement le body de la réponse.
    // observe: 'response': Angular récupére la réponse complète, y compris les en-têtes 
      map((res: any) => {
        const authHeader = res.headers.get('authorization');
        const token = authHeader ? authHeader.substring(7) : null;
        const user = res.body;

        if (token && user) {
          this.userStorageService.saveToken(token);
          this.userStorageService.saveUser(user);
          return true;
        }
        return false;
      })
    );
  }
}