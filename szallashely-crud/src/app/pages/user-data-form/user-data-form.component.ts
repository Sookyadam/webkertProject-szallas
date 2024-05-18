import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserData } from '../../model/userData.model';

@Component({
  selector: 'app-user-data-form',
  templateUrl: './user-data-form.component.html',
  styleUrls: ['./user-data-form.component.css']
})
export class UserDataFormComponent implements OnInit, OnChanges {
  @Input() userData: UserData | undefined;
  @Output() save = new EventEmitter<UserData>();

  userDataForm: FormGroup;

  constructor() {
    this.userDataForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      postNumber: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userData'] && this.userData) {
      this.initForm();
    }
  }

  initForm() {
    this.userDataForm.setValue({
      name: this.userData?.name || '',
      mobile: this.userData?.mobile || '',
      country: this.userData?.country || '',
      postNumber: this.userData?.postNumber || '',
      city: this.userData?.city || '',
      address: this.userData?.address || ''
    });
  }

  onSubmit() {
    if (this.userDataForm.valid) {
      this.save.emit(this.userDataForm.value);
    }
  }
}
