import { Injectable } from '@angular/core';
import { MentionedUser } from './users-store.interfaces';

@Injectable()
export class UsersStoreService {
    public mentionedUsers: MentionedUser[] = [];

    constructor() {
    }

    public getMentionedUsers(): MentionedUser[] {
        return this.mentionedUsers;
    }

    public updateMentionedUsers(users: MentionedUser[]): void {
        this.mentionedUsers = users;
    }

    public getAllIncomes(searchStr: string): string {
        if (!searchStr) {
            return;
        }

        const strHasUsersIncomes = /@|#/g;
        const substrArr = searchStr.split(' ');

        substrArr.forEach((item, index) => {
            const hasUser = item.match(strHasUsersIncomes);
            if (hasUser) {
                const user = this.mentionedUsers.find((i) => i.id === item.trim());
                substrArr[index] = user ? user.strForBack : item;
            }
        });

        return substrArr.join(' ');
    }
}
