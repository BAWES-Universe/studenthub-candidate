import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'split'
})
export class SplitPipe implements PipeTransform {
    
    transform(val:string, params: any):string {
        if(val)
            return val.split(params)[0];
    }
}