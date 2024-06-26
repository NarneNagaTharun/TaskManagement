import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  http: HttpClient = inject(HttpClient);

  logError(data: { statusCode: number; errorMessage: string; dateTime: Date }) {
    this.http
      .post("https://http-c1fd1-default-rtdb.firebaseio.com/log.json", data)
      .subscribe((response) => console.log(response));
  }

  fetchErrors() {
    this.http
      .get("https://http-c1fd1-default-rtdb.firebaseio.com/log.json")
      .subscribe((data) => console.log(data));
  }
}
