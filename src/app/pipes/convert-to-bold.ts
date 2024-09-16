import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'convertToBold',
})
export class ConvertToBoldPipe implements PipeTransform {

  /**
   * Convert To Bold
   */
  transform(value: string) {
    if(value)
      return  value.replace(/\*([^*]+)\*/g , '<b>$1</b>');
  }
}
