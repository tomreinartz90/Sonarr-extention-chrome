import {Http, Headers, Jsonp} from "angular2/http";
import {Component, Inject} from "angular2/core";
import {Response} from "angular2/http";
import {Observable} from "rxjs/Observable";


export class SonarrService {
    private apikey:string = '';
    private url:string = '';
    private http:Http;

    constructor (@Inject(Http) http:Http) {
        console.log('starting service');
        this.http = http;
        this.getSettingsFromLocalStorage();
    }

    getSettingsFromLocalStorage () {
        var settings = JSON.parse( localStorage.getItem('settings') );
        if(settings !== null) {
            this.apikey = settings.apikey;
            this.url = settings.url;
        }
    }

    setUrlAndApiKey (url:string, apikey:string) {
        this.url = url;
        this.apikey = apikey;
    }

    getWantedEpisodes () {
        return this.http.get(this.url + 'api/wanted/missing?page=1&pageSize=30&sortKey=airDateUtc&sortDir=desc&apikey=' + this.apikey );
    }

    getCalendar () {
        return this.http.get(this.url + 'api/calendar?apikey=' + this.apikey );
    }

    getAllSeries(){
        return this.http.get(this.url + 'api/series?apikey=' + this.apikey );
    }

    getSeriesById(id:number){
        return this.http.get(this.url + 'api/series/?apikey=' + this.apikey );
    }

    getEpisodeById(episodeId:number){
        return this.http.get(this.url + 'api/episode/' + episodeId + '?apikey=' + this.apikey );
    }
    getEpisodesBySeriesId(seriesId:number){
        return this.http.get(this.url + 'api/episode?seriesId=' + seriesId + '&apikey=' + this.apikey );
    }

    getHistory(){
        return this.http.get(this.url + 'api/history?page=1&pageSize=10&sortKey=date&sortDir=desc&apikey=' + this.apikey );
    }

    manualDownloadEpisode(episodeId:number){
        return this.http.get(this.url + 'api/release?episodeId='+ episodeId +'&apikey=' + this.apikey );
    }

    getVersion():any {
        return this.http.get(this.url + 'api/system/status?apikey=' + this.apikey );
    }

    getPoster(images){
        var poster:string = null;
        var _this = this;
        images.forEach(function(image){
            if(image.coverType == "poster") {
                if(image.url.indexOf('http') == -1) {
                    poster = _this.url + image.url + '&apikey=' + _this.apikey;
                    poster = poster.replace('sonarr', 'api');
                    poster = poster.replace('poster', 'poster-250');
                } else {
                    poster = image.url;
                }

            }
        });

        if(poster != null)
            return poster;

    }
}