// NOTES: TypeScript unable to correctly parse boolean, always treats as string
export class ProteaUser {
    public name = '';
    public avatar = '';
    public address = '';
    public MNID = '';
    public phone = '';
    public email = '';
    public isAdmin: boolean = false;
    public isRegistered: boolean = false;
    public hasAttended: boolean = false;
    public isPaid: boolean = false;
    public balance = -1;
    public issued = -1;
    public publicEncKey = '';
    public pushToken = '';

    public constructor(init?: Partial<ProteaUser>) {
        Object.assign(this, init);
    }
}
