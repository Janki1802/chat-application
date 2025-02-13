import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService);
  inputMessage = "";
  messages: any[] = [];
  router = inject(Router);
  loggedInUserName = sessionStorage.getItem("user");
  roomName = sessionStorage.getItem("room");

  searchText: string = '';  // Add this for search input
  connectedUsers: string[] = [];  // Holds all connected users
  filteredUsers: string[] = [];  // Holds filtered users based on search

  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

  ngOnInit(): void {
    // Subscribe to messages
    this.chatService.messages$.subscribe(res => {
      this.messages = res;
      console.log(this.messages);
    });

    // Subscribe to connected users and set filtered users
    this.chatService.connectedUsers$.subscribe(res => {
      this.connectedUsers = res;
      this.filteredUsers = res;  // Initialize filtered users with all connected users
    });
  }

  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
    this.chatService.sendMessage(this.inputMessage)
      .then(() => {
        this.inputMessage = '';
      }).catch((err) => {
        console.log(err);
      });
  }

  leaveChat() {
    this.chatService.leaveChat()
      .then(() => {
        this.router.navigate(['welcome']);
        setTimeout(() => {
          location.reload();
        }, 0);
      }).catch((err) => {
        console.log(err);
      });
  }

  // Method to filter users based on search text
  searchUsers() {
    this.filteredUsers = this.connectedUsers.filter(user =>
      user.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

}
