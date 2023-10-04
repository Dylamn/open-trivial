import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavController } from '@ionic/angular'
import { DataService } from '../services/data.service'
import { Camera, CameraResultType } from '@capacitor/camera'

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {
  points: number = 0
  photo: string | undefined
  constructor(private nav: NavController, private activatedRoute: ActivatedRoute, private dataSrv: DataService) {}

  ngOnInit() {
    this.points = Number.parseInt(this.dataSrv.serviceData ?? '0', 10)
  }

  restart() {
    this.nav.navigateRoot(['/home'])
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    })
    
    if (!image?.webPath) {
      return
    }
    
    this.photo = image.webPath
  }
}
