import {Component} from '@angular/core';
import {FORM_DIRECTIVES, FormBuilder, Validators, Control, ControlGroup} from '@angular/common';
import {Alert, NavController} from 'ionic-angular';
import { Api } from '../../services/api/api';
import { AMAZON_S3_SERVICE } from '../../constants';

@Component({
  templateUrl: 'build/pages/add/add.html',
  providers: [FormBuilder, Api]
})
export class AddPage {

  form;
  images: string[] = [];
  errorMessage: string;

  constructor(private nav: NavController, private api: Api) {
    this.form = new ControlGroup({
      title: new Control("", Validators.required),
      description: new Control("", Validators.required)
    });
  }

  processForm() {
    let alert = Alert.create({
      title: "Post Created",
      message: "Post: " + this.form.value.title + " " + this.form.value.description,
      buttons: [{
        text: 'Ok',
      }]
    });

    if (this.form.status === 'VALID') {
      this.addPost(this.form.value)
      this.nav.present(alert);
    }
  }

  /*
    Function to carry out the actual PUT request to S3 using the signed request from the app.
  */
  private uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      console.log('xhr', xhr)
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          this.images.push(url);
          // document.getElementById('preview').src = url;
          // document.getElementById('avatar-url').value = url;
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  /*
    Function to get the temporary signed request from the app.
    If request successful, continue to upload the file using this signed
    request.
  */
  private getSignedRequest(file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${AMAZON_S3_SERVICE}?fileType=${file.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  /*
   Function called when file input updated. If there is a file selected, then
   start upload procedure by asking for a signed request from the app.
  */
  initUpload(input){
    for (let i = 0; i < input.files.length; i++) {
      let file = input.files[i];

      if(file == null){
        return alert('No file selected.');
      }
      this.getSignedRequest(file);
    }
  }


  private addPost(data) {
    data.images = this.images;
    this.api.addPost(data)
     .subscribe(
       data => console.log('data', data),
       error =>  this.errorMessage = <any>error);
  }

}
