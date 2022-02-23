import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../core/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { menuModel, MenuService } from '../menu.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    public authservice: AuthService,
    public afAuth: AngularFireAuth,
    private db: AngularFirestore,
    public menuService: MenuService
  ) {}

  formularioPelicula: NgForm;

  // CAMPOS MODEL
  dia;
  entrada;
  principal;
  bebida;
  postre;
  mensaje;

  // CAMPOS DATOS RECIBIDOS
  taskId;
  menues$: Observable<any[]>;
  arrayMenues: any[];
  carta$: Observable<any[]>;
  arrayCarta: any[];

  mensajeEspecial: boolean = false;
  toggle = true;
  status = 'Enable'; 
  lastClicked: number;

  async ngOnInit() {
// GET MENU DEL DIA DATA OBSERVABLE
    this.menues$ = this.db
      .collection(`${'MenuDelDia'}`)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            //Get document data
            const data = a.payload.doc.data() as menuModel;
            //Get document id
            const id = a.payload.doc.id;
            //Use spread operator to add the id to the document data
            return { id, ...data };
          });
        })
      );

// PUSH MENU DEL DIA DATA OBSERVABLE TO ARRAY
    this.menues$.subscribe((e) => {
      e.sort(function (a, b) {
        return b.idOrder - a.idOrder;
      });
      this.arrayMenues = e;
      console.log(this.arrayMenues)
    });

// GET CARTA DATA OBSERVABLE
    this.carta$ = this.db
    .collection(`${'Carta'}`)
    .snapshotChanges()
    .pipe(
      map((actions) => {
        return actions.map((a) => {
          //Get document data
          const data = a.payload.doc.data() as menuModel;
          //Get document id
          const id = a.payload.doc.id;
          //Use spread operator to add the id to the document data
          return { id, ...data };
        });
      })
    );

// PUSH CARTA DATA OBSERVABLE TO ARRAY
    this.carta$.subscribe(e =>{
      this.arrayCarta = e;
      console.log(this.arrayCarta)
    })

  }

  menuEnviado(dia, entrada, principal, bebida, postre) {
    let idOrder;

    if (dia == 'Lunes') {
      idOrder = 7;
    }
    if (dia == 'Martes') {
      idOrder = 6;
    }
    if (dia == 'Miercoles') {
      idOrder = 5;
    }
    if (dia == 'Jueves') {
      idOrder = 4;
    }
    if (dia == 'Viernes') {
      idOrder = 3;
    }
    if (dia == 'Sabado') {
      idOrder = 2;
    }
    if (dia == 'Domingo') {
      idOrder = 1;
    }

    this.menuService.menuEnviado(
      dia,
      entrada,
      principal,
      bebida,
      postre,
      idOrder
      
    );
  }

  deleteTask(task) {
    this.taskId = task.id;
    this.menuService.deleteMenu(this.taskId);
  }

  ocultar(taskid, plato, adicional, precio, hidden){
    this.taskId = taskid;
    let isHidden:boolean = false;
    if (hidden == false){
      isHidden = true;
    }
    this.menuService.ocultarMenu(this.taskId, isHidden);
  }

  enableDisableRule(index){
    console.log('works two buttons jeje D:');
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
  }

  logout() {
    this.authservice.logout();
  }



}
