import { Injectable } from '@angular/core'; 
// or 
import { Observable, of } from 'rxjs';


/**
 * Manages Language Functionality on the server
 */
@Injectable({
    providedIn: 'root'
})
export class LanguageService { 

    constructor( 
    ) { }

    /**
     * List language available to translate 
     */
    listToTranslate(): Observable<any> {
        return of([
            { name: 'English', Language: 'English', code: 'en' },
            { name: 'عربى', Language: 'Arabic',code: 'ar' }
        ]);
    } 
}