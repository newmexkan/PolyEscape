import {Platform} from "ionic-angular";

export class PlatformHelper{

    url: string;

  constructor(public plt: Platform) {
    if (plt.is("mobileweb")) {
      console.log("Nous sommes bien dans un mobile web");
      this.url = "http://localhost:8080";
    } else {
      this.url = "http://polyescape-server-polyescape-server.193b.starter-ca-central-1.openshiftapps.com"
    }

   // this.url = "http://localhost:8080";
  }

  getUrl(){
    return this.url;
  }

  isLocalhost(){
    if(this.url.includes("localhost"))
      return true;
    return false;
  }
}
