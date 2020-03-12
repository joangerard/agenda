import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class MockActiveRouter {
  snapshot: any;
  paramMock: any;

  constructor() {
    this.snapshot = {
      paramMap: {
        get(): any {

        }
      }
    }
  }
}