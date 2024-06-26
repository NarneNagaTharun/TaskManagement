import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Task } from "src/app/Models/Task";
import { TasksService } from "src/app/Services/tasks.service";

@Component({
  selector: "app-task-details",
  templateUrl: "./task-details.component.html",
  styleUrls: ["./task-details.component.css"],
})
export class TaskDetailsComponent {
  @Output() EventEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() currentTask: Task;
  @Input() isLoading: boolean = true;

  closeTaskDetails() {
    this.EventEmitter.emit(false);
    // this.EventEmitter.emit(); //This also works even if not emitting anything
  }
}
