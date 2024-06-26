import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Task } from "src/app/Models/Task";

@Component({
  selector: "app-create-task",
  templateUrl: "./create-task.component.html",
  styleUrls: ["./create-task.component.css"],
})
export class CreateTaskComponent implements AfterViewInit {
  @Output()
  CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  createTaskFormValueObjectEmitter: EventEmitter<Task> =
    new EventEmitter<Task>();

  @Input() isEditMode: boolean = false;

  @Input() selectedTask: Task;

  @ViewChild("taskForm") taskForm: NgForm;

  ngAfterViewInit() {
    // setTimeout(() => this.taskForm.setValue(this.selectedTask), 0); ->
    // setValue method expects object that matches exactly the "value" property of the NgForm, But "selectedTask" property have an object which have an extra propery named "id", And NgForm in this component does not have "id" form control in it ==>> So if we use setValue to update the form with "selectedTask" object, Then error occurs. ==>> Uncomment and run this line of code
    setTimeout(() => this.taskForm.form.patchValue(this.selectedTask), 0);
    //So using patchValue() method to update the form, Which accepts anything(part of NgForm.value object structure or extra properties also)
  }

  OnCloseForm() {
    // this.CloseForm.emit();
    this.CloseForm.emit(false);
  }

  onFormSubmitted(form: NgForm) {
    console.log(form);
    this.createTaskFormValueObjectEmitter.emit(form.value);
  }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------
// import { Component, EventEmitter, Output } from "@angular/core";
// import { NgForm } from "@angular/forms";
// import { Task } from "src/app/Models/Task";

// @Component({
//   selector: "app-create-task",
//   templateUrl: "./create-task.component.html",
//   styleUrls: ["./create-task.component.css"],
// })
// export class CreateTaskComponent {
//   @Output()
//   CloseForm: EventEmitter<boolean> = new EventEmitter<boolean>();

//   @Output()
//   createTaskFormValueObjectEmitter: EventEmitter<Task> =
//     new EventEmitter<Task>();

//   OnCloseForm() {
//     // this.CloseForm.emit();
//     this.CloseForm.emit(false);
//   }

//   onFormSubmitted(form: NgForm) {
//     console.log(form);
//     this.createTaskFormValueObjectEmitter.emit(form.value);
//   }
// }
