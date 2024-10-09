import { Injectable } from '@angular/core';
import { DataService } from '../interfaces/data-service';
import { Person } from '../interfaces/person';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Model } from '../interfaces/model';


export abstract class generic<T>{
    public abstract method1<T>():void;
}
export class DataInStorageService<T extends Model> extends DataService<T>{
    
    

    private generarCodigoAlfanumerico(): string {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let codigo = "";
        for (let i = 0; i < 10; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          codigo += caracteres[indiceAleatorio];
        }
        return codigo;
      }

    constructor(){
        super();
        console.log("DataInStorageService created");
    }

    public override create(value: T): Observable<T> {
        return new Observable((observer)=>{
            value.id = this.generarCodigoAlfanumerico();
            const _records = this._records.value;
            this._records.next([..._records, value]);
            observer.next(value);
            observer.complete();
            localStorage.setItem("Item created", JSON.stringify(observer))
        });  
    }

    public override requestAll(): Observable<T[]> {
        localStorage.setItem("Request all", JSON.stringify(this._records.asObservable))
        return this._records.asObservable()
    }

    public override requestById(id: string): Observable<T | null> {
        let idx = this._records.getValue().findIndex(p => p.id = id);
        return of(this._records.getValue()[idx])
    }

    public override update(id: string, value: T): Observable<T | null> {
        let people:T[] = this._records.getValue()
        let idx = people.findIndex(p => p.id = id)
        let person = people[idx]
        people[idx] = value;
        people.slice(idx,1)
        this._records.next(people);
        return of(person)
    }

    public override delete(id: string): Observable<T | null> {
        let people:T[] = this._records.getValue()
        let idx = people.findIndex(person => person.id==id);
        let person = people[idx];
        people.splice(idx,1)
        this._records.next(people)
        return of(person)
    }
    

   

}
