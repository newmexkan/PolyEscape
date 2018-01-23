import {Platform} from "ionic-angular";

export class PlatformHelper{

    url: string;


  constructor(public plt: Platform) {
      this.url = "http://polyescape-server-polyescape-server.193b.starter-ca-central-1.openshiftapps.com"
  }

  getUrl(){
    return this.url;
  }

  isLocalhost(){
    if(this.url.includes("localhost"))
      return true;
    return false;
  }
  isRealServer(){
    if(this.url.includes("polyescape-server-polyescape-server"))
      return true;
    return false;
  }
}
