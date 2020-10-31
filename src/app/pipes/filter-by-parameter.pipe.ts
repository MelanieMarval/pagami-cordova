import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterByParameter',
})
export class FilterByParameter implements PipeTransform {

    transform(items: any[], search: string, parameters = ['name']): any {
        if (!search || search.trim() === '') {
            return items;
        } else {
            return items.filter(item => {
                let value;
                parameters.forEach(param => {
                    if (item[param] && item[param].toLowerCase().includes(search.toLowerCase())) {
                        value = item;
                    }
                });
                if (value) { return value; }
            });
        }
    }

}
