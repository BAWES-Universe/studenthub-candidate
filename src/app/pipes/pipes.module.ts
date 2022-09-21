import { NgModule } from '@angular/core';
import { AgePipe } from './age.pipe';

import {TimeSpentPipe} from './timespent.pipe';
import { TimerPipe } from './timer.pipe';
import {SplitPipe} from "./split.pipe";


// import custom pipes here
@NgModule({
    declarations: [
        TimerPipe,
        AgePipe,
        SplitPipe,
        TimeSpentPipe
    ],
    imports: [],
    exports: [
        TimerPipe,
        AgePipe,
        SplitPipe,
        TimeSpentPipe
    ]
})
export class PipesModule {}
