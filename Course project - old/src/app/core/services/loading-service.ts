import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class LoaderService {
    public isLoading = new BehaviorSubject(false);
    public isLoadingFullSpinner = new BehaviorSubject(false);
    constructor() {}
}


