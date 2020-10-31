import { NgModule } from '@angular/core';
import { CapitalizePipe } from './capitalize.pipe';
import { NoImagePipe } from './no-image.pipe';
import { PluralPipe } from './plural.pipe';
import { FilterPlacePipe } from './filter-place.pipe';
import { FilterByNamePipe } from './filter-by-name.pipe';
import { FilterCategoryPipe } from './filter-category.pipe';
import { FilterByParameter } from './filter-by-parameter.pipe';

@NgModule({
    declarations: [
        CapitalizePipe,
        NoImagePipe,
        PluralPipe,
        FilterPlacePipe,
        FilterCategoryPipe,
        FilterByNamePipe,
        FilterByParameter
    ],
    imports: [],
    exports: [
        CapitalizePipe,
        NoImagePipe,
        PluralPipe,
        FilterPlacePipe,
        FilterByNamePipe,
        FilterByParameter,
        FilterPlacePipe,
        FilterCategoryPipe
    ],
    providers: []
})
export class PipesModule {
}
