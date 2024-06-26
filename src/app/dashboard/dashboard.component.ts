import { Component, OnInit, inject } from "@angular/core";
import { Task } from "../Models/Task";
import { TasksService } from "../Services/tasks.service";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  allTasks: Task[] = [];
  tasksService: TasksService = inject(TasksService);
  editMode: boolean = false;
  selectedTask: Task;
  currentTaskId: string | undefined;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  errorSub: Subscription;
  taskDetailComp: boolean = false;
  currentTask: Task;
  isLoadingTaskDetails: boolean = false;

  ngOnInit() {
    this.fetchAllTasks();
    this.errorSub = this.tasksService.errorSubject.subscribe((error) => {
      console.log(error);
      this.setErrorMessage(error);
    });
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
    this.editMode = false;
    this.selectedTask = {
      assignedTo: "",
      createdAt: "",
      description: "",
      priority: "",
      status: "",
      title: "",
    };
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  createTask(data: Task) {
    this.showCreateTaskForm = false;
    if (!this.editMode) {
      this.tasksService.createTask(data);
    } else {
      this.tasksService.updateTask(this.currentTaskId, data);
    }
  }

  // onEditTaskClicked(task: Task) {
  //   this.showCreateTaskForm = true;
  //   this.editMode = true;
  //   console.log(task);
  //   this.selectedTask = task;
  // }

  onEditTaskClicked(id: string | undefined) {
    this.showCreateTaskForm = true;
    this.editMode = true;
    this.selectedTask = this.allTasks.find((task) => {
      return task.id === id;
    });
    this.currentTaskId = id;
  }

  openTaskDetails(id: string | undefined) {
    this.taskDetailComp = true;
    this.isLoadingTaskDetails = true;
    this.tasksService.fetchTaskDetail(id).subscribe({
      next: (data: Task) => {
        // console.log(data);
        this.currentTask = data;
        this.isLoadingTaskDetails = false;
      },
    });
  }

  closeTaskDetails() {
    this.taskDetailComp = false;
  }

  fetchAllTasksData() {
    this.fetchAllTasks();
  }

  //In tasks.service.ts fetchAllTasks() method is returning an observable -> Here we are subscribing to that observable -> So the observable emits task data -> And in next() methos we are assigning it to "allTasks" property
  private fetchAllTasks() {
    this.isLoading = true; //Put this loader code before subscribing, Because if placed after subscribe, Even before executing this line of code we might get the data from server and display in UI. Always place loader=true before subscribing.
    this.tasksService.fetchAllTasks().subscribe({
      next: (tasks) => {
        console.log(tasks);
        this.allTasks = tasks;
        this.isLoading = false; // After getting the data, We are unrendering the loader html tag
      },
      error: (error) => {
        console.log(error);
        this.setErrorMessage(error);
        this.isLoading = false;
      },
    });
  }

  private setErrorMessage(error: HttpErrorResponse) {
    if (error.error.error === "Permission denied") {
      this.errorMessage = "you do not have permission to perform this action";
    } else {
      this.errorMessage = error.message;
    }
    setTimeout(() => (this.errorMessage = null), 3000);
  }

  deleteTask(id: string | undefined) {
    this.tasksService.deleteTask(id);
  }

  deleteAllTasks() {
    this.tasksService.deleteAllTasks();
  }
}

// -----------------------------------------------------------------------------------------------------------------------------------------------
//My Tries
// fetchAllTasks() {
//   this.http
//     .get("https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json")
//     .subscribe((data: any) => {
//       console.log(data);
//       this.tasksData = Object.values(data);
//       console.log(this.tasksData);
//     });
// }

// filterTasksByPriority(changeEvent: any) {
//   console.log(changeEvent);
//   console.log(changeEvent.target.value);
//   this.tasksData = this.tasksData.filter((task) => {
//     return task.priority === changeEvent.target.value;
//   });
// }

// -----------------------------------------------------------------------------------------------------------------------------------------------
// Code before migrating HTTP Requests code into TasksService class
/*
import { Component, OnInit, inject } from "@angular/core";
import { Task } from "../Models/Task";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  showCreateTaskForm: boolean = false;
  http: HttpClient = inject(HttpClient);
  allTasks: Task[] = [];

  ngOnInit() {
    this.fetchAllTasks();
  }

  OpenCreateTaskForm() {
    this.showCreateTaskForm = true;
  }

  CloseCreateTaskForm() {
    this.showCreateTaskForm = false;
  }

  createTask(data: Task) {
    console.log(data);
    this.showCreateTaskForm = false;
    this.http
      .post("https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json", data, {
        headers: { "my-header-1": "hello world", "my-header-2": "202" },
      })
      .subscribe((response) => {
        console.log(response);
        //Below line of code - Analyze It
        this.fetchAllTasks();
        //Above line of code - Analyze It
      });
  }

  fetchAllTasks() {
    this.http
      .get<{ [key: string]: Task }>(
        "https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json"
      )
      .pipe(
        map((response) => {
          let tasks = [];
          for (let key in response) {
            if (response.hasOwnProperty(key))
              tasks.push({ ...response[key], id: key });
          }

          return tasks;
        })
      )
      .subscribe((tasks) => {
        console.log(tasks);
        this.allTasks = tasks;
      });
  }

  deleteTask(id: string | undefined) {
    this.http
      .delete(
        "https://http-c1fd1-default-rtdb.firebaseio.com/tasks/" + id + ".json"
      )
      .subscribe((response) => {
        console.log(response);
        this.fetchAllTasks();
      });
  }

  deleteAllTasks() {
    this.http
      .delete("https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json")
      .subscribe((response) => {
        console.log(response);
        this.fetchAllTasks();
      });
  }
}

// fetchAllTasks() {
//   this.http
//     .get("https://http-c1fd1-default-rtdb.firebaseio.com/tasks.json")
//     .subscribe((data: any) => {
//       console.log(data);
//       this.tasksData = Object.values(data);
//       console.log(this.tasksData);
//     });
// }

// filterTasksByPriority(changeEvent: any) {
//   console.log(changeEvent);
//   console.log(changeEvent.target.value);
//   this.tasksData = this.tasksData.filter((task) => {
//     return task.priority === changeEvent.target.value;
//   });
// }

*/

// ----------------------------------------------------------------------------------------------------------------------------------------------
// import { Component, OnInit, inject } from "@angular/core";
// import { Task } from "../Models/Task";
// import { TasksService } from "../Services/tasks.service";

// @Component({
//   selector: "app-dashboard",
//   templateUrl: "./dashboard.component.html",
//   styleUrls: ["./dashboard.component.css"],
// })
// export class DashboardComponent implements OnInit {
//   showCreateTaskForm: boolean = false;
//   allTasks: Task[] = [];
//   tasksService: TasksService = inject(TasksService);

//   ngOnInit() {
//     this.fetchAllTasks();
//   }

//   OpenCreateTaskForm() {
//     this.showCreateTaskForm = true;
//   }

//   CloseCreateTaskForm() {
//     this.showCreateTaskForm = false;
//   }

//   createTask(data: Task) {
//     this.showCreateTaskForm = false;
//     this.tasksService.createTask(data);
//   }

//   fetchAllTasksData() {
//     this.fetchAllTasks();
//   }

//   //In tasks.service.ts fetchAllTasks() method is returning an observable -> Here we are subscribing to that observable -> So the observable emits task data -> And in next() methos we are assigning it to "allTasks" property
//   private fetchAllTasks() {
//     this.tasksService.fetchAllTasks().subscribe((tasks) => {
//       console.log(tasks);
//       this.allTasks = tasks;
//     });
//   }

//   deleteTask(id: string | undefined) {
//     this.tasksService.deleteTask(id);
//   }

//   deleteAllTasks() {
//     this.tasksService.deleteAllTasks();
//   }
// }
