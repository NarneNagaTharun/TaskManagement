import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Task } from "../Models/Task";
import { catchError, map, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";
import { LoggerService } from "./Logger.service";
// import { DashboardComponent } from "../dashboard/dashboard.component";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  http: HttpClient = inject(HttpClient);
  // dashboardComp: DashboardComponent = inject(DashboardComponent);
  errorSubject = new Subject<HttpErrorResponse>();
  loggerService: LoggerService = inject(LoggerService);

  createTask(task: Task) {
    console.log(task);

    this.http
      .post("https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json", task, {
        headers: {
          "my-header-1": "hello world",
          "my-header-2": "202",
        },
      })
      .pipe(
        catchError((error, caught) => {
          console.log(caught);
          this.loggerService.logError({
            statusCode: error.status,
            errorMessage: error.message,
            dateTime: new Date(),
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          //Below line of code - Analyze It
          // this.fetchAllTasks();
          // this.dashboardComp.fetchAllTasksData();
          //Above line of code - Analyze It
        },
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  //Here map return an observable which emits tasks data -> So instead of returning some data from this method, we are returning that observable emited by map from this function -> So developer can subscribe in which ever file needed and handle it in next(method)
  fetchAllTasks() {
    let headers = new HttpHeaders();
    headers = headers.append("content-type", "application.json");
    headers = headers.append("header1", "hi");
    headers = headers.append("content-type", "text/html");

    let httpParams = new HttpParams();
    httpParams = httpParams.set("page", 2);
    httpParams = httpParams.set("item", 10);

    return this.http
      .get<{ [key: string]: Task }>(
        "https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json",
        { headers: headers, params: httpParams, observe: "response" }
      )
      .pipe(
        map((response) => {
          console.log(response);
          console.log(response.body);
          let tasks = [];
          for (let key in response.body) {
            if (response.body.hasOwnProperty(key))
              tasks.push({ ...response.body[key], id: key });
          }

          return tasks; //This is a CallBack function, And every function should return something(Not necessarily, But in this case have to return some data), And map() will return an observable which emits the data that is returning by the CB func  of map(CB Func) ==>> That's why we wrote this return statement.
        }),
        catchError((error) => {
          this.loggerService.logError({
            statusCode: error.status,
            errorMessage: error.message,
            dateTime: new Date(),
          });
          return throwError(() => error);
        })
      );
  }

  deleteTask(id: string | undefined) {
    this.http
      .delete(
        "https://http-c1fd1-default-rtdb.firebaseio.com/tasks/" + id + ".json"
      )
      .pipe(
        catchError((error) => {
          this.loggerService.logError({
            statusCode: error.status,
            errorMessage: error.message,
            dateTime: new Date(),
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          // this.fetchAllTasks();
          // this.dashboardComp.fetchAllTasksData();
        },
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  deleteAllTasks() {
    this.http
      .delete("https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json", {
        observe: "events",
      })
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            alert("Delete Request Sent");
          }
        }),
        catchError((error) => {
          this.loggerService.logError({
            statusCode: error.status,
            errorMessage: error.message,
            dateTime: new Date(),
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          // this.fetchAllTasks();
          // this.dashboardComp.fetchAllTasksData();
        },
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  updateTask(id: string | undefined, data: Task) {
    this.http
      .put(
        "https://http-c1fd1-default-rtdb.firebaseio.com/tasks/" + id + ".json",
        data
      )
      .pipe(
        catchError((error) => {
          this.loggerService.logError({
            statusCode: error.status,
            errorMessage: error.message,
            dateTime: new Date(),
          });
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => console.log(response),
        error: (error) => {
          this.errorSubject.next(error);
        },
      });
  }

  fetchTaskDetail(id: string | undefined) {
    return this.http
      .get(
        "https://http-c1fd1-default-rtdb.firebaseio.com/tasks/" + id + ".json"
      )
      .pipe(
        map((data) => {
          // console.log(data);
          let task = {};
          task = { ...data, id: id };

          return task;
        })
      );
  }
}
