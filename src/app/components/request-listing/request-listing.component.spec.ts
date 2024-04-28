import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {IonicModule} from '@ionic/angular';

import {RequestListingComponent} from './request-listing.component';

describe('RequestListingComponent', () => {
    let component: RequestListingComponent;
    let fixture: ComponentFixture<RequestListingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RequestListingComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(RequestListingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
