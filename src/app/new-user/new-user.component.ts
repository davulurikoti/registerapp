import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AvatarDialogComponent } from "../avatar-dialog/avatar-dialog.component";
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  exampleForm: FormGroup;
  avatarLink: string = "https://firebasestorage.googleapis.com/v0/b/register-94b35.appspot.com/o/person-1824144_960_720.png?alt=media&token=0e1e04a9-81e3-4a23-bba8-0e5c065c758c";

  validation_messages = {
   'name': [
     { type: 'required', message: 'Name is required.' }
   ],
   'visitorpass': [
     { type: 'required', message: 'Visitor card number is required.' }
   ],
   'persontomeet': [
     { type: 'required', message: 'Name of the person you meet is required.' },
   ],
   'organization': [
     { type: 'required', message: 'Organization is required.' },
   ],
   'purpose': [
     { type: 'required', message: 'purpose of this visit is required.' }
   ],
   'esscortnumber': [
     { type: 'required', message: 'Escort employee id is required.' },
   ],
   'escortname': [
     { type: 'required', message: 'Escort name is required.' },
   ],
   'dov': [
     { type: 'required', message: 'Visit date is required.' },
   ]
 };

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private router: Router,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: ['', Validators.required ],
      organization: ['', Validators.required ],
      persontomeet: ['', Validators.required ],
      purpose: ['', Validators.required ],
      esscortnumber: ['', Validators.required ],
      escortname: ['', Validators.required ],
      dov: ['', Validators.required ]
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      height: '400px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.avatarLink = result.link;
      }
    });
  }

  resetFields(){
    this.avatarLink = "https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg";
    this.exampleForm = this.fb.group({
      name: new FormControl('', Validators.required),
      organization: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      age: new FormControl('', Validators.required),
    });
  }

  onSubmit(value){
    this.firebaseService.createUser(value, this.avatarLink)
    .then(
      res => {
        this.resetFields();
        this.router.navigate(['/home']);
      }
    )
  }

}
