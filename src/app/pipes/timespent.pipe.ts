import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'timeSpent',
})
export class TimeSpentPipe implements PipeTransform {

    public timer: number;

    constructor(
    ) {}

	transform(value: number) {

    if (!value) {
      return 0;
    }

    let seconds = 0;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let months = 0;
    seconds = value;
    if (seconds > 60) {
      minutes = (value / 60);
    }
    if (minutes > 60) {
      hours = (minutes / 60);
    }
    if (hours > 24) {
      days = (hours / 24);
    }
    if (days > 31) {
      months = (days / 31);
    }

    if (months) {
      return months.toFixed(2) + ' months';
    }
    if (days) {
      return days.toFixed(2) + ' days';
    }
    if (hours) {
      return hours.toFixed(2) + ' hours';
    }
    if (minutes) {
      return minutes.toFixed(2) + ' minutes';
    }
    if (seconds) {
      return seconds.toFixed(2) + ' seconds';
    }
  }
}

