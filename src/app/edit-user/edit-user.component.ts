import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { AvatarDialogComponent } from "../avatar-dialog/avatar-dialog.component";
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { AngularFireStorage,AngularFireUploadTask,AngularFireStorageReference } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  exampleForm: FormGroup;
  item: any;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  snapshot: Observable<any>;
    uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  generatedImage :any;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
 
  public signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 5,
    'canvasWidth': 500,
    'canvasHeight': 300
  };

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
   ]
 };

  constructor(
    public firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.item = data.payload.data();
        this.item.id = data.payload.id;
        this.createForm();
      }
    })
  }

  createForm() {
    this.exampleForm = this.fb.group({
      name: [this.item.name, Validators.required ],
      organization: [this.item.organization, Validators.required ],
      visitorpass: [this.item.visitorpass, Validators.required ],
      persontomeet: [this.item.persontomeet, Validators.required ],
      purpose: [this.item.purpose, Validators.required ],
      esscortnumber: [this.item.esscortnumber, Validators.required ],
      escortname: [this.item.escortname, Validators.required]
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AvatarDialogComponent, {
      height: '400px',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.item.avatar = result.link;
      }
    });
  }

  onSubmit(value){
    value.avatar = this.item.avatar;
    value.visitorpass = this.item.visitorpass;
    value.persontomeet = this.item.persontomeet;
    value.purpose = this.item.purpose;
    value.esscortnumber = this.item.esscortnumber;
    value.escortname = this.item.escortname;
    value.dov = this.item.dov;
    value.status = 1;
    this.firebaseService.updateUser(this.item.id, value)
    .then(
      res => {
        this.router.navigate(['/home']);
      }
    )
  }

  delete(){
    this.firebaseService.deleteUser(this.item.id)
    .then(
      res => {
        this.router.navigate(['/home']);
      },
      err => {
        console.log(err);
      }
    )
  }

  cancel(){
    this.router.navigate(['/home']);
  }
  ngAfterViewInit() {
    // this.signaturePad is now available
    this.signaturePad.set('minWidth', 5); // set szimek/signature_pad options at runtime
    this.signaturePad.clear(); // invoke functions from szimek/signature_pad API
  }
 
  drawComplete() {
    // will be notified of szimek/signature_pad's onEnd event
    var encoded_image = this.signaturePad.toDataURL().split(",")[1];
    console.log(encoded_image);
    const imageName = 'mytest.jpeg';
  // call method that creates a blob from dataUri
  const imageBlob = this.dataURItoBlob(encoded_image);
  const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
  this.ref = this.storage.ref("test/koti.jpeg");
    this.task = this.ref.put(imageFile);
    this.uploadPercent = this.task.percentageChanges();
    // get notified when the download URL is available
    this.task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = this.ref.getDownloadURL() )
     )
    .subscribe()
    
  }
    
 
  drawStart() {
    // will be notified of szimek/signature_pad's onBegin event
    console.log('begin drawing');
  }
  dataURItoBlob(dataURI) {
   const byteString = window.atob(dataURI);
   const arrayBuffer = new ArrayBuffer(byteString.length);
   const int8Array = new Uint8Array(arrayBuffer);
   for (let i = 0; i < byteString.length; i++) {
     int8Array[i] = byteString.charCodeAt(i);
   }
   const blob = new Blob([int8Array], { type: 'image/jpeg' });    
   return blob;
}

}
