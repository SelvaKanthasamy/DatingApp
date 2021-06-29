import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';


@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
  
})

export class MemberCardComponent implements OnInit {

  @Input() member: Member;

  constructor(private router: Router, private memberService: MembersService, private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  // btnClick= function (username) {
  //   this.router.navigateByUrl('/members/' + username);
  // };

  viewProfile(username: string){
    this.router.navigateByUrl('/members/' + username);
  }

  addLike(member: Member){
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('You have liked ' + member.knownAs);
    })
  }

}
