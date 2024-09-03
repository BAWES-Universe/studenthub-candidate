import { NgModule } from '@angular/core';
import { AgePipe } from './age.pipe';

import {TimeSpentPipe} from './timespent.pipe';
import { TimerPipe } from './timer.pipe';
import {SplitPipe} from "./split.pipe";
import {TimeAgoPipe} from "./timeago.pipe";
import { SecondsToTimePipe } from "./secondToTime.pipe";
import { ConvertToBoldPipe } from "./convert-to-bold";

// import custom pipes here
@NgModule({
    declarations: [
        TimerPipe,
        AgePipe,
        SplitPipe,
        TimeAgoPipe,
        TimeSpentPipe,
        SecondsToTimePipe,
        ConvertToBoldPipe
    ],
    imports: [],
    exports: [
        TimerPipe,
        AgePipe,
        SplitPipe,
        TimeAgoPipe,
        TimeSpentPipe,
        SecondsToTimePipe,
        ConvertToBoldPipe
    ]
})
export class PipesModule {}
