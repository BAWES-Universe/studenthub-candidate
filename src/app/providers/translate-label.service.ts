import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})

export class TranslateLabelService extends TranslateService {

    convertedValue: string;

    /**
     * Get translation for given word
     * @param keyString
     */
    transform(keyString: string, params = null): string {

        if (!keyString) {
            return keyString;
        }

        this.convertedValue = '';

        this.get(keyString, params).subscribe(value => {
            this.convertedValue = value;
        });

        return this.convertedValue ? this.convertedValue : keyString;
    }

    /**
     * return app direction
     */
    direction() {
        return this.currentLang == 'ar' ? 'rtl' : 'ltr';
    }

    /**
     * Make date readable by Safari
     * @param date
     */
    toDate(date) {
        if (date) {
        return new Date(date.replace(/-/g, '/'));
        }
    }
    
    /**
     * Return content based on language selected
     * @param enContent
     * @param arContent
     */
    langContent(enContent, arContent) {

        if (this.currentLang == 'ar' && arContent) {
            return arContent;
        }

        return enContent? enContent: arContent;
    }

    /**
     * json to string error message
     * @param message
     */
    errorMessage(message): string {

        if (message.length)
        {
            return message + '';
		}

        const a = [];

        for (const i in message) {

            if (!Array.isArray(message[i])) {
                a.push(message[i]);
                continue;
            }

            for (const j of message[i]) {
                a.push(j);
            }
        }

        return a.join('<br />');
    }
}
