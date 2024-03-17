import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'split',
    pure: false
})
export class SplitPipe implements PipeTransform {
    
    transform(val:string, params: any):string {
        if(val)
            return val.split(params)[0];
    }
    
    async ngOnDestroy() {

    }
}