import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error: string;
  loading = false;
  action: 'login' | 'signup' = 'login';

  constructor(
      private router: Router,
      private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  uid;
  

  async onSubmit(form: NgForm) {

      this.loading = true;
      this.error = null;
      const { firstName, lastName, email, password, phoneNumber } = form.value;
      let resp;

      try {

          if (this.isSignUp) {
              resp = await this.afAuth.createUserWithEmailAndPassword(email, password);

              await resp.user.updateProfile(
                  { displayName: `${firstName} ${lastName}` }
              );

              form.reset();
          } else {
              resp = await this.afAuth.signInWithEmailAndPassword(email, password);
          }
          const uid = resp.user.uid;
          this.uid = resp.user.uid;
          this.router.navigate([`/profile/${uid}`]);

      } catch (error) {
          console.log(error.message);
          this.error = error.message;
      }

      this.loading = false;
      console.log(this.uid)
  }

  get isLogin() {
      return this.action === 'login';
  }

  get isSignUp() {
      return this.action === 'signup';
  }
}