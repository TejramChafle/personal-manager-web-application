import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  transform(records: any, ...args: any[]): Array<string> {
    if (args[0] && args[0].length) {
      return records.filter((record)=>{
        return record.name.toLowerCase().includes(args[0].toLowerCase());
      });
    } else {
      return records;
    }
  }
}
