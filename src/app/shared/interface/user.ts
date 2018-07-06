export class ProteaUser {
    public name = '';
    public avatar = '';
    public address = '';
    public MNID = '';
    public phone = '';
    public email = '';
    public isAdmin = false;
    public isRegistered = false;
    public hasAttended = false;
    public isPaid = false;
    public balance = 0;

    public constructor(init?: Partial<ProteaUser>) {
        Object.assign(this, init);
    }
}
