import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
//services
import { AuthHttpService } from './authhttp.service';
//models
import { Candidate } from 'src/app/models/candidate';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountEndpoint = '/account';

  constructor(private _authhttp: AuthHttpService) { }

  /**
   * load profile details
   */
  profile(): Observable<any> {
    const url = this._accountEndpoint + '/profile?expand=area,isProfileCompleted,nationality,country,university,candidateSkills,candidateExperiences';
    return this._authhttp.get(url);
  }

  profileWithBank(): Observable<any> {
    const url = this._accountEndpoint + '/profile?expand=bank';
    return this._authhttp.get(url);
  }

  /**
   * get job search status
   */
  getJobSearchStatus(): Observable<any> {
    const url = this._accountEndpoint + '/job-search-status?expand=brands';
    return this._authhttp.get(url);
  }

  /**
   * update job-search-status
   * @param params 
   */
  updateJobSearchStatus(params): Observable<any>{
    const url = `${this._accountEndpoint}` + '/job-search-status';
    return this._authhttp.post(url, params);
  }

  /**
   * update experiences
   * @param params 
   */
  updateExperiences(params): Observable<any>{
    const url = `${this._accountEndpoint}` + '/update-experiences';
    return this._authhttp.post(url, params);
  }
  
  /**
   * update skills
   * @param params 
   */
  updateSkills(params): Observable<any>{
    const url = `${this._accountEndpoint}` + '/update-skills';
    return this._authhttp.post(url, params);
  }

  /**
   * remove civol id front photo
   */
  removeCivilPhotoFront(): Observable<any> {
    let url = this._accountEndpoint + '/remove-civil-photo-front';
    return this._authhttp.delete(url);
  }

  /**
   * remove civol id back photo
   */
  removeCivilPhotoBack(): Observable<any> {
    let url = this._accountEndpoint + '/remove-civil-photo-back';
    return this._authhttp.delete(url);
  }

  /**
   * Remove candidate's profile photo 
   */
  removePhoto(): Observable<any> {
    let url = this._accountEndpoint + '/remove-photo';
    return this._authhttp.delete(url);
  }

  /**
   * List of all stores
   * @returns {Observable<any>}
   */
  listSalary(page: number): Observable<any> {
    const url = this._accountEndpoint + '/salary?page=' + page + '&expand=bank';
    return this._authhttp.get(url, true);
  }

  /**
   * Create
   * @param {oldPassword} string
   * @param {newPassword} string
   * @returns {Observable<any>}
   */
  changePassword(oldPassword: string, newPassword: string): Observable<any>{
    const postUrl = `${this._accountEndpoint}` + '/change-password';
    const params = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    return this._authhttp.post(postUrl, params);
  }

  /**
   * Update email address 
   * @param email string 
   */
  updateEmail(email: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-email';
    return this._authhttp.post(url, { email: email });
  }

  /**
   * set user language preference 
   * @param code language code 
   */
  setLanguagePref(code): Observable<any> {
    let url = `${this._accountEndpoint}` + '/language-pref';
    return this._authhttp.post(url, {
        language_pref: code
    });
  }

  /**
   * update nationality
   * @param country_id number
   */
  updateNationality(country_id: number): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-nationality';
    return this._authhttp.post(url, {
      country_id: country_id
    });
  }

  /**
   * update university
   * @param university_id number
   */
  updateUniversity(university_id: number): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-university';
    return this._authhttp.post(url, {
      university_id: university_id
    });
  }

  /**
   * area by geo cordinates
   * @param latitude 
   * @param longitude 
   */
  areaByLocation(latitude, longitude, area = null): Observable<any> {
    let url = `${this._accountEndpoint}` + '/area-by-location?latitude=' + latitude + '&longitude=' + longitude;

    if(area)
      url += '&area=' + area;

    return this._authhttp.get(url);
  }

  /**
   * update objective
   * @param objective string
   */
  updateObjective(objective: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-objective';
    return this._authhttp.post(url, {
      objective: objective
    });
  }

  /**
   * update gender
   * @param gender number
   */
  updateGender(gender: number): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-gender';
    return this._authhttp.post(url, {
      gender: gender
    });
  }

  /**
   * update name
   * @param name string
   */
  updateName(name: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-name';
    return this._authhttp.post(url, {
      name: name
    });
  }

  /**
   * update arabic name
   * @param name_ar string
   */
  updateNameAr(name_ar: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-name-ar';
    return this._authhttp.post(url, {
      name_ar: name_ar
    });
  }

  /**
   * update civil id number
   * @param civil_id 
   */
  updateCivilId(civil_id: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-civil-id';
    return this._authhttp.post(url, {
      civil_id: civil_id
    });
  }

  /**
   * update resume
   * @param resume string
   */
  updateResume(resume: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-resume';
    return this._authhttp.post(url, {
      resume: resume
    });
  }

  /**
   * update candidate location
   * @param params 
   */
  updateLocation(params): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-location';
    return this._authhttp.post(url, params);
  }

  /**
   * check cloudinary video status 
   */
  checkVideoStatus(): Observable<any> {
    let url = `${this._accountEndpoint}` + '/video-status';
    return this._authhttp.get(url);
  }

  /**
   * update Video to introduct candidate
   * @param candidate_video string
   */
  updateVideo(candidate_video: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/video';
    return this._authhttp.post(url, {
      video: candidate_video
    });
  }
  
  /**
   * delete Video 
   */
  deleteVideo(): Observable<any> {
    let url = `${this._accountEndpoint}` + '/remove-video';
    return this._authhttp.delete(url);
  }

  /**
   * update profile photo
   * @param personal_photo string
   */
  updateProfilePhoto(personal_photo: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/profile-photo';
    return this._authhttp.post(url, {
      personal_photo: personal_photo
    });
  }

  /**
   * update birth-date
   * @param birth_date string
   */
  updateBirthDate(birth_date: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-birth-date';
    return this._authhttp.post(url, {
      birth_date: birth_date
    });
  }

  /**
   * update back image of civil id
   * @param civil_photo_back 
   */
  updateCivilPhotoBack(civil_photo_back: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-civil-photo-back';
    return this._authhttp.post(url, {
      civil_photo_back: civil_photo_back
    });
  }

  /**
   * update front image of civil id
   * @param civil_photo_front 
   */
  updateCivilPhotoFront(civil_photo_front: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-civil-photo-front';
    return this._authhttp.post(url, {
      civil_photo_front: civil_photo_front
    });
  }

  /**
   * update civil expiry date
   * @param civil_expiry_date 
   */
  updateCivilExpiryDate(civil_expiry_date: string): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-civil-expiry-date';
    return this._authhttp.post(url, {
      civil_expiry_date: civil_expiry_date
    });
  }

  /**
   * update driving license
   * @param driving_license number
   */
  updateDrivingLicense(driving_license: number): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-driving-license';
    return this._authhttp.post(url, {
      driving_license: driving_license
    });
  }

  /**
   * update kuwaiti National Status
   * @param candidate_mom_kuwaiti number
   */
  updateKuwaitiNationalStatus(candidate_mom_kuwaiti: number): Observable<any> {
    let url = `${this._accountEndpoint}` + '/update-kuwaiti-national';
    return this._authhttp.post(url, {
      candidate_mom_kuwaiti: candidate_mom_kuwaiti
    });
  }

  updateBankDetail(params): Observable<any> {
    return this._authhttp.post(this._accountEndpoint + '/update-bank-detail', params);
  }

  updatePhoneDetail(params): Observable<any> {
    return this._authhttp.post(this._accountEndpoint + '/update-phone', params);
  }
}
