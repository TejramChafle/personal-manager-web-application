export class Returning {
    constructor (
        public type: string,
        public amount: number,
        public date: Date,
        public person: string,
        public purpose: string,
        public expectedReturnDate: Date,
        public paymentMethod: string,
        public createdDate: Date,
        public user: string,
        public id?: string,
        public updatedDate?: Date,
    ) {}
}