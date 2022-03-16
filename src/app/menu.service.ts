import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(public db: AngularFirestore, public afAuth: AngularFireAuth) { }

  private taskDoc: AngularFirestoreDocument<menuModel>;

  private taskDoc2: AngularFirestoreDocument<cartaModel>;

  async menuEnviado(dia, entrada, principal, bebida, postre, idOrder) {
    //Add the new task to the collection
    const uid = (await this.afAuth.currentUser).uid;

    this.db
      .collection(`${'MenuDelDia'}`)
      .doc()
      .set({
        dia: dia,
        entrada: entrada,
        principal: principal,
        bebida: bebida,
        postre: postre,
        fecha: new Date().toDateString().substring(0,3),
        idOrder: idOrder
      })
      .then();
  }


  async cartaEnviada(plato, precio, categoria, hidden, adicional, alergenos) {
    //Add the new task to the collection
    const uid = (await this.afAuth.currentUser).uid;
    let precioNumber = precio;
    let precioWithSymbol = precioNumber + ' €'
    console.log(precioWithSymbol);

    this.db
      .collection(`${'Carta'}`)
      .doc()
      .set({
        plato: plato,
        precio: precioWithSymbol,
        categoria: categoria,
        hidden: hidden,
        adicional: adicional,
        alergenos: alergenos,
      })
      .then();
  }


  async deleteMenu(id) {
    const uid = (await this.afAuth.currentUser).uid;
    this.taskDoc = this.db
      .collection(`${'MenuDelDia'}`)
      .doc<menuModel>(`${id}`);
    this.taskDoc.delete();
  }

  async ocultarMenu(id, isHidden) {
    const uid = (await this.afAuth.currentUser).uid;

    
    this.taskDoc2 = this.db
      .collection(`${'Carta'}`)
      .doc<cartaModel>(`${id}`);
    this.taskDoc2.update({
      hidden : isHidden
      
    }), { merge: true }
  }

  // updateTask(id, task) {
  //   this.db.collection('MenuDelDia').doc(`${id}`).set(
  //     {
  //       okey: task,
  //       completed: true,
  //     },
  //     { merge: true }
  //   );
  // }


}

export class menuModel {
  constructor(
    public dia?: string,
    public entrada?: string,
    public principal?: string,
    public bebida?: number,
    public postre?: string,
    public mensaje?: string
  ) {}
}

export class cartaModel {
  constructor(
    public plato?: string,
    public adicional?: string,
    public precio?: string,
    public hidden?: boolean
  ) {}
}