import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public db: AngularFirestore) {}

  getAvatars(){
      return this.db.collection('/avatar').valueChanges()
  }

  getUser(userKey){
    return this.db.collection('users').doc(userKey).snapshotChanges();
  }

  updateUser(userKey, value){
    value.nameToSearch = value.name.toLowerCase();
    return this.db.collection('users').doc(userKey).set(value);
  }

  deleteUser(userKey){
    return this.db.collection('users').doc(userKey).delete();
  }

  getUsers(date){
    var formattedDate = this.getFormattedDate(date);
    console.log(formattedDate);
    return this.db.collection('users',ref => ref.where('dov', '==', formattedDate)).snapshotChanges();
  }

  searchUsers(searchValue){
    return this.db.collection('users',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }

  searchUsersByAge(value){
    return this.db.collection('users',ref => ref.orderBy('age').startAt(value)).snapshotChanges();
  }


  createUser(value, avatar){
    return this.db.collection('users').add({
      name: value.name,
      nameToSearch: value.name.toLowerCase(),
      organization: value.organization,
      visitorpass: parseInt(value.visitorpass),
      persontomeet: value.persontomeet,
      purpose: value.purpose,
      esscortnumber: parseInt(value.esscortnumber),
      escortname: value.escortname,
      dov: this.getFormattedDate(value.dov),
      status: 0,
      avatar: avatar
    });
  }
  getFormattedDate(date) {
    var todayTime = new Date(date);
    var month = todayTime .getMonth() + 1;
    var day = todayTime .getDate();
    var year = todayTime .getFullYear();
    return month + "/" + day + "/" + year;
  }
}
