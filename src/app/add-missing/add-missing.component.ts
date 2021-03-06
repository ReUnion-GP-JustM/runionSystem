import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomelessService } from '../homeless.service'
import { SuperAdminPrivalgesService } from '../super-admin-privalges.service';
import { UserService } from '../user.service';
declare var $:any;
@Component({
  selector: 'app-add-missing',
  templateUrl: './add-missing.component.html',
  styleUrls: ['./add-missing.component.scss']
})
export class AddMissingComponent implements OnInit {
  images: any;
  responseData:any[]=[];
  load : boolean = false;
  result: boolean=false;
  notFound:boolean=false;
  addForm : boolean = false;
  searchForm : boolean = true;
  policeStationLists: any;
  egyptCity: any;
  shelterList: any ;

  constructor(public _HomelessService: HomelessService ,public _SuperAdminPrivalgesService:SuperAdminPrivalgesService , public _UserService:UserService) {
    this.egyptCity = _UserService.egyptCity;
    // this.getAllPloceStation();
    this.getAllShelter();
   }


getAllPloceStation() {
  this._SuperAdminPrivalgesService.getAllPoliceSations().subscribe(response => {
    if (response.message == 'done') {

      this.policeStationLists = response.policeStationList;
      
    } else {
      console.log("fail");

    }
  })

}

getAllShelter() {
  this._SuperAdminPrivalgesService.getAllShlter().subscribe(response => {
    if (response.message == 'done') {
      this.shelterList = response.shelterList;
      this.load = false;
    } else {
      console.log("fail");

    }
  })

}

  // selectImage
  selectImage(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.images = file;
      console.log(this.images);

    }
  }


//step one search in report before add to HomeLess
 //formData
  searchReport = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,20}$/)]),
    age: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
    gender: new FormControl('male', [Validators.required]),
    image: new FormControl('', [Validators.required]),
  })
  // api Method
  hadelSearchRport(){
    if (this.searchReport.valid) {
      this.load = true;
      const formData = new FormData();
      formData.append("img", this.images);
      formData.append("name", this.searchReport.controls.name.value);
      formData.append("endAge", this.searchReport.controls.age.value + 5);
      formData.append("startAge", this.searchReport.controls.age.value);
      formData.append("gender", this.searchReport.controls.gender.value);

      this._HomelessService.seachINReport(formData).subscribe(response => {
        if (response.message == "search Done") {
          this.load = false;
          this.result = true
          this.responseData = response.matchedResult;
          console.log(this.responseData.length );
          
          if (this.responseData.length == 0) {
        this.notFound=true
            
          }
        }
        console.log(this.responseData);

      })
    }
  }

  

  nameValue:String = '';
  ageValue:any;
  genderValue:boolean= true;
  imgValue:String ='' ;
 
  reportID:any;
  getHomelessID(id:any){
    console.log(id);
    
      this.reportID = id;
      console.log( this.reportID);
      
    this.addMissing.controls.name.setValue(this.searchReport.controls.name.value);
    this.addMissing.controls.age.setValue(this.searchReport.controls.age.value);
    this.addMissing.controls.gender.setValue(this.searchReport.controls.gender.value);
     
      
  }
  communicateParents() {
    if (this.addMissing.valid) {
      this.load = true;
      const formData = new FormData();
      formData.append("img", this.images);
      formData.append("name", this.searchReport.controls.name.value);
      formData.append("age", this.addMissing.controls.age.value);
      formData.append("gender", this.addMissing.controls.gender.value);
      formData.append("shelterName", this.addMissing.controls.shelterName.value);
      formData.append("description", this.addMissing.controls.description.value);
      formData.append("foundlocation", this.addMissing.controls.city.value);
      formData.append("foundTime", this.addMissing.controls.foundTime.value);
      formData.append("finderName", this.addMissing.controls.finderName.value);
      formData.append("finderNationID", this.addMissing.controls.nationID.value);
      formData.append("finderPhone", this.addMissing.controls.phoneNumber.value);
      formData.append("finderEmail", this.addMissing.controls.finderEmail.value);



      this._HomelessService.communcateWithParents(formData , this.reportID).subscribe(response => {
        console.log(response);
        
        if (response.message == "Done") {
         
          alert("Done");
          $("#exampleModal").modal("hide");
          this.addMissing.reset();
          this.load = false;
        }else if (response.message == "already in coummunicate") {
          alert("already in coummunicate");
          this.load = false;
        } else if (response.message == "invalid report") {
          alert("invalid report");
          this.load = false;
        }else if (response.message == "in-valid input") {
          alert("in-valid input");
          this.load = false;
        }else if (response.message == "catch error") {
          alert("fail");
          this.load = false;
        }

      })
    }
  }

  addMissing = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,20}$/)]),
    age: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(3)]),
    city: new FormControl('القاهره', [Validators.required]),
    shelterName: new FormControl('shelterOne', [Validators.required]),
    gender: new FormControl(``, [Validators.required]),
    // image: new FormControl('', [Validators.required]),
    foundTime: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required, Validators.pattern(/^[\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,500}$/)]),
    finderName: new FormControl('', [Validators.required, Validators.pattern(/^[\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{2,20}$/)]),
    nationID: new FormControl('', [Validators.required, Validators.pattern(/(2|3)[0-9][1-9][0-1][1-9][0-3][1-9](01|02|03|04|11|12|13|14|15|16|17|18|19|21|22|23|24|25|26|27|28|29|31|32|33|34|35|88)\d\d\d\d\d/)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    finderEmail: new FormControl('', [Validators.email, Validators.required])

  });
  



  changeDiaply(){
    console.log("lol");
    this.notFound = false;
    this.addForm = true;
    this.addMissing.controls.name.setValue(this.searchReport.controls.name.value);
    this.addMissing.controls.age.setValue(this.searchReport.controls.age.value);
    this.addMissing.controls.gender.setValue(this.searchReport.controls.gender.value);
  }
  // displaysearchHomeless(){
  //   this.addForm= false;
  //   this.searchForm=true;
  // }
  handelAddMissing() {
    if (this.addMissing.valid) {
      this.load = true;
      const formData = new FormData();
      formData.append("img", this.images);
      formData.append("name", this.searchReport.controls.name.value);
      formData.append("age", this.addMissing.controls.age.value);
      formData.append("gender", this.addMissing.controls.gender.value);
      formData.append("shelterName", this.addMissing.controls.shelterName.value);
      formData.append("description", this.addMissing.controls.description.value);
      formData.append("foundlocation", this.addMissing.controls.city.value);
      formData.append("foundTime", this.addMissing.controls.foundTime.value);
      formData.append("finderName", this.addMissing.controls.finderName.value);
      formData.append("finderNationID", this.addMissing.controls.nationID.value);
      formData.append("finderPhone", this.addMissing.controls.phoneNumber.value);
      formData.append("finderEmail", this.addMissing.controls.finderEmail.value);



      this._HomelessService.addHomeless(formData).subscribe(response => {
        console.log(response);
        
        if (response.message == "added successfully") {
          alert("added successfully");
          this.addMissing.reset();
          this.searchReport.reset();
          this.addForm= false;
          this.searchForm=true;
          this.load = false;
        }else if (response.message == "already in coummunicate") {
          this.load = false;
          alert("already in coummunicate");
        } else if (response.message == "already exist") {
          alert("already exist");
          this.load = false;
        }else if (response.message == "in-valid shelter id") {
          alert("in-valid shelter id");
          this.load = false;
        }else if (response.message == "please enter valid data err") {
          alert("in-valid input");
          this.load = false;
        }else if (response.message == "catch err") {
          alert("fail");
          this.load = false;
        }

      })
    }
  }
  ngOnInit(): void {


  }

 




 

}
