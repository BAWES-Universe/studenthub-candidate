import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController, IonInput, AlertController } from '@ionic/angular';
import { Plugins } from '@capacitor/core'; 
import { environment } from 'src/environments/environment';
//models
import { Candidate } from 'src/app/models/candidate';
//services
import { TranslateLabelService } from 'src/app/providers/translate-label.service';
import { AccountService } from 'src/app/providers/logged-in/account.service';
import { GoogleMapService } from 'src/app/providers/logged-in/google-map.service';


declare var google;

const { Geolocation } = Plugins;

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  public isLoading: boolean = false;

  public updating: boolean = false;

  public candidate: Candidate;

  public form: FormGroup;

  public places = [];

  public map;//: google.maps.Map;

  public marker;

  public area;

  public query: string = '';

  @ViewChild('searchInput', { static: false }) searchInput;

  constructor(
    public _fb: FormBuilder,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public accountService: AccountService,
    public googleMapService: GoogleMapService,
    public translateService: TranslateLabelService
  ) { }

  ngOnInit() {
    this._initForm();

    setTimeout(() => {
      if(this.searchInput)
        this.searchInput.setFocus();
    }, 500);
  }

  initMap(lat, long): void {

    this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
      center: { lat: lat, lng: long },
      zoom: 15,
      mapTypeId: 'terrain'
    });

    this.updateMarker(lat, long);
  }

  ionViewDidEnter() {

    console.log(this.searchInput);

    let ele = this.searchInput.nativeElement as HTMLInputElement;

    let autocomplete = new google.maps.places.Autocomplete(ele, {
      types: ['(regions)'],
      componentRestrictions: { country: 'kw' }
    });

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      var place = autocomplete.getPlace();
      console.log(place);
      this.areaByLocation(place.geometry.location.lat(), place.geometry.location.lng(), place.name);
    });
  }

  /**
   * Return search result
   * @param ev
   */
  async getItems(ev: any) {

    this.query = ev.target.value;

    if (!this.query || this.query.length == 0) {
      this.places = [];
      return;
    }

    this.googleMapService.getPlacePredictions(this.query).subscribe(result => {

      if (!result || result.length == 0) {
        return null;
      }

      this.places = [];

      const a = [];

      // political
      for (const i of result) {

        if (i.types.indexOf('country') > -1) {
          continue;
        }

        // to avoid duplicate

        const b = i.structured_formatting.main_text + i.terms[i.terms.length - 1].value;

        if (a.indexOf(b) > -1) {
          continue;
        }

        a.push(b);

        // show place to user

        this.places.push(i);
      }
    });
  }

  /**
   * Place selected from search result
   * @param place
   */
  placeSelected(place) {

    const ok = this.translateService.transform('Okay');

    this.isLoading = true;

    this.googleMapService.placeDetail(place).subscribe(result => {
      
      this.isLoading = false;

      if (result.operation == 'success') {
        this.setArea(result.area, result.area.area_latitude, result.area.area_longitude);
      } 
      else 
      {
        this.alertCtrl.create({
          message: this.translateService.errorMessage(result.message),
          buttons: [ok]
        }).then(alert => alert.present());
      }
    }, () => {
      this.isLoading = false;
    });
  }

  public addMarker(lat: number, lng: number) {

    let latLng = new google.maps.LatLng(lat, lng);

    let image = environment.marker ? {
      url: environment.marker,
      rotation: 0,
      scale: 4,
      //anchor: new google.maps.Point(0, 0),
    }: {
      //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
      rotation: 0,
      scale: 4,
      //anchor: new google.maps.Point(0, 0),
    };

    let marker = new google.maps.Marker({
      map: this.map,
      icon: image,
      animation: google.maps.Animation.DROP,
      position: latLng,
      draggable:true
    });

    marker.addListener('dragend', (event) => {
      console.log(event);
      this.areaByLocation(event.latLng.lat(), event.latLng.lng());
    });

    return marker;
  }

  /**
   * Initialise form
   */
  async _initForm() {

    this.form = this._fb.group({
      area_uuid: [this.candidate.candidate_area_uuid, Validators.required],
      latitude: [this.candidate.candidate_latitude, Validators.required],
      longitude: [this.candidate.candidate_longitude, Validators.required],
    });

    if(this.candidate.candidate_latitude && this.candidate.candidate_longitude) {
      this.initMap(this.candidate.candidate_latitude, this.candidate.candidate_longitude);
    }
    else 
    {
      this.getUserLocation();
    }
  }

  getUserLocation() {

    const locationOptions = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };

    Geolocation.getCurrentPosition(locationOptions).then((resp) => {
      if (resp && resp.coords) {
        this.areaByLocation(resp.coords.latitude, resp.coords.longitude);
      } 
    }).catch((error) => {
      console.log(error);
      
      this.alertCtrl.create({
        header: this.translateService.transform('Error'),
        message: this.translateService.transform('Getting location'),
        buttons: [this.translateService.transform('Okay')]
      }).then(alert => alert.present());
    });
  }

  areaByLocation(latitude, longitude, area = null) {

    this.isLoading = true;

    this.accountService.areaByLocation(latitude, longitude, area).subscribe(result => {

      this.isLoading = false;

      if (result.operation == 'success' && result.area) {
            
        this.setArea(result.area, latitude, longitude);
        
      } else {

        this.alertCtrl.create({
          header: result.message,
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => alert.present());
      }
    }, () => {

      this.isLoading = false;
    });
  }

  setArea(area, latitude, longitude) {

    //reset search
    this.query = null; 

    this.area = area;

    this.form.controls.area_uuid.setValue(area.area_uuid);

    this.form.controls.latitude.setValue(latitude);
    
    this.form.controls.longitude.setValue(longitude);

    this.form.markAsDirty();
    this.form.updateValueAndValidity();

    if(!this.map)
      this.initMap(latitude, longitude);
    else 
      this.updateMarker(latitude, longitude);
  }

  /**
   * save location
   */
  submit() {
    this.updating = true; 

    this.accountService.updateLocation(this.form.value).subscribe(res => {

      this.updating = false;

      if(res.operation == 'success') {
        this.candidate.area = this.area;
        this.candidate.candidate_area_uuid = this.form.value.area_uuid;
        this.candidate.candidate_latitude = this.form.value.latitude;
        this.candidate.candidate_longitude = this.form.value.longitude;
        this.dismiss();
      } else {
        this.alertCtrl.create({
          message: this.translateService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });
      }
    }, () => {
      this.updating = false;
    });
  }

  updateMarker(latitude, longitude) {

    if (!this.marker) {

      //add marker to map 

      this.marker = this.addMarker(latitude, longitude);

    } else {

      //update marker position on map
      this.marker.setPosition(new google.maps.LatLng(latitude, longitude));
    }

    this.map.panTo(new google.maps.LatLng(latitude, longitude));
  }

  /**
   * close modal
   * @param data 
   */
  dismiss(data = {}) {
    this.modalCtrl.getTop().then(overlay => {
      if (overlay)
        this.modalCtrl.dismiss(data);
    });
  }
}

