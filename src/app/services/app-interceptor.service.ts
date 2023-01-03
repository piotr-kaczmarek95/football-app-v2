import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

export class AuthInterceptorService implements HttpInterceptor{

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const modifiedRequest = req.clone({headers: req.headers.append('X-Auth-Token', environment.footballDataApiKey)})
        return next.handle(modifiedRequest)
    }
}
