import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavController } from '@ionic/angular'
import { DataService } from '../services/data.service'

@Component({
  selector: 'app-score',
  templateUrl: './score.page.html',
  styleUrls: ['./score.page.scss'],
})
export class ScorePage implements OnInit {
  points: number = 0

  constructor(private nav: NavController, private activatedRoute: ActivatedRoute, private dataSrv: DataService) {}

  ngOnInit() {
    this.points = Number.parseInt(this.dataSrv.serviceData ?? '0', 10)
  }

  restart() {
    this.nav.navigateRoot(['/home'])
  }
}
